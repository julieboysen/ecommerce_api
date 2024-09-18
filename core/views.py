from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import ProductSerializer, CartItemSerializer
from .models import User, Product, ShoppingCart, Order
import stripe
from django.conf import settings
from rest_framework import viewsets
from django.shortcuts import get_object_or_404

User = get_user_model()
stripe.api_key = settings.STRIPE_API_KEY

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not username or not email or not password:
            return Response({'error': 'Username, email, and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    
class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

    def get_queryset(self):
        query = self.request.query_params.get('q', None)
        if query:
            return Product.objects.filter(name__icontains=query)
        return Product.objects.all()
   
class CartView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart_items = ShoppingCart.objects.filter(user=request.user)
        serializer = CartItemSerializer(cart_items, many=True)

        # Calculate total cart value
        total_value = sum(item.product.price * item.quantity for item in cart_items)

        return Response({
            "cart_items": serializer.data,
            "total_value": total_value
        })

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)  # Default to 1 if not provided

        if not product_id:
            return Response({"error": "Product ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if enough stock is available
        if product.stock < quantity:
            return Response({"error": "Not enough stock available"}, status=status.HTTP_400_BAD_REQUEST)

        # Deduct the stock from the product
        product.stock -= quantity
        product.save()

        # Add the product to the cart
        cart_item, created = ShoppingCart.objects.get_or_create(
            user=request.user,
            product=product,
            defaults={'quantity': quantity}
        )

        if not created:
            # If the product is already in the cart, update the quantity
            cart_item.quantity += quantity
            cart_item.save()

        return Response({"message": "Product added to cart", "stock_status": "in_stock" if product.stock > 0 else "out_of_stock"}, status=status.HTTP_201_CREATED)

    def delete(self, request):
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        if not product_id:
            return Response({"error": "Product ID is required to remove item"}, status=status.HTTP_400_BAD_REQUEST)

        cart_item = get_object_or_404(ShoppingCart, user=request.user, product_id=product_id)

        # Increase the product stock when item is removed from the cart
        product = cart_item.product
        product.stock += quantity
        product.save()

        # Decrease the quantity or remove the cart item if quantity is 1
        if cart_item.quantity > 1:
            cart_item.quantity -= quantity
            cart_item.save()
        else:
            cart_item.delete()

        return Response({"message": "Product removed from cart", "new_stock": product.stock}, status=status.HTTP_200_OK)


class CheckoutView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Get cart items for the authenticated user
        cart_items = ShoppingCart.objects.filter(user=request.user)
        if not cart_items:
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate total amount
        total_amount = sum(item.product.price * item.quantity for item in cart_items)

        # Create a Stripe payment intent
        try:
            intent = stripe.PaymentIntent.create(
                amount=int(total_amount * 100),  # Amount in cents
                currency='usd',
                payment_method=request.data.get('payment_method_id'),
                confirmation_method='manual',
                confirm=True,
                return_url='http://localhost:3000/'
            )
        except stripe.error.CardError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Create an order record
        order = Order.objects.create(
            user=request.user,
            total_value=total_amount,
        )

        # Clear the cart
        cart_items.delete()

        return Response({
            "status": "success",
            "order_id": order.id,
            "client_secret": intent.client_secret  # Send client_secret to the frontend
        }, status=status.HTTP_200_OK)
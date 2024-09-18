from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Product, ShoppingCart
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class UserTests(APITestCase):
    
    def test_user_registration(self):
        url = reverse('register')
        data = {'username': 'testuser', 'email': 'testuser@example.com', 'password': 'password123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
    
    def test_user_login(self):
        user = User.objects.create_user(username='testuser', password='password123')
        url = reverse('login')
        data = {'username': 'testuser', 'password': 'password123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

class CartTests(APITestCase):
    
    def setUp(self):
        # Create a user and authenticate
        self.user = User.objects.create_user(username='testuser', password='password123')
        url = reverse('login')
        data = {'username': 'testuser', 'password': 'password123'}
        response = self.client.post(url, data, format='json')
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        # Create a product
        self.product = Product.objects.create(name='Test Product', price=50.00, stock=10)
    
    def test_add_product_to_cart(self):
        url = reverse('cart')
        data = {'product_id': self.product.id, 'quantity': 2}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        product = Product.objects.get(id=self.product.id)
        self.assertEqual(product.stock, 8)
    
    def test_remove_product_from_cart(self):
        ShoppingCart.objects.create(user=self.user, product=self.product, quantity=3)
        url = reverse('cart')
        data = {'product_id': self.product.id, 'quantity': 2}
        response = self.client.delete(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        product = Product.objects.get(id=self.product.id)
        self.assertEqual(product.stock, 12)

    def test_cart_value_calculation(self):
        ShoppingCart.objects.create(user=self.user, product=self.product, quantity=2)
        url = reverse('cart')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_value'], 100.00)

class CheckoutTests(APITestCase):

    def setUp(self):
        # Create a user and authenticate
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.product = Product.objects.create(name='Test Product', price=100.00, stock=5)
        
        # Generate JWT token for the user
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

        # Add product to cart
        ShoppingCart.objects.create(user=self.user, product=self.product, quantity=2)

        # Set the authorization header with the token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

    def test_checkout(self):
        # Checkout payload
        data = {
            "payment_method_id": "pm_card_visa"  # Example Stripe payment method ID
        }

        # Call the checkout endpoint
        response = self.client.post('/checkout/', data, format='json')

        # Ensure the response is successful
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check if cart is cleared
        cart_items = ShoppingCart.objects.filter(user=self.user)
        self.assertEqual(cart_items.count(), 0)

        # Check if order is created
        self.assertTrue(response.data['order_id'])

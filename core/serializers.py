from rest_framework import serializers
from .models import Product, ShoppingCart

class ProductSerializer(serializers.ModelSerializer):
    out_of_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'stock', 'out_of_stock']

    def get_out_of_stock(self, obj):
        return obj.stock == 0

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()  # Include the product details

    class Meta:
        model = ShoppingCart
        fields = '__all__'  # Fields you want to serialize
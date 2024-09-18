from django.contrib import admin
from .models import User, Product, ShoppingCart

admin.site.register(User)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'stock']
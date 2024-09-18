from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()


class User(AbstractUser):
    email = models.EmailField(unique=True, default="default@example.com")
    created_at = models.DateTimeField(auto_now_add=True)

    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_set",
        blank=True,
        help_text="The groups this user belongs to.",
        related_query_name="custom_user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions",
        blank=True,
        help_text="Specific permissions for this user.",
        related_query_name="custom_user_permission",
    )

    def __str__(self):
        return self.username


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class ShoppingCart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total_value = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    # Add other fields as needed

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


class Restaurant(models.Model):
    """
    Restaurant profile within each tenant
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True, blank=True, null=True)
    description = models.TextField(blank=True)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    website = models.URLField(blank=True)
    logo = models.ImageField(upload_to='restaurant_logos/', blank=True, null=True)
    cover_image = models.ImageField(upload_to='restaurant_covers/', blank=True, null=True)
    
    # Business details
    cuisine_type = models.CharField(max_length=50, blank=True)
    opening_hours = models.JSONField(default=dict, blank=True)  # Store as JSON
    delivery_fee = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    minimum_order = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    delivery_radius = models.PositiveIntegerField(default=5)  # in kilometers
    
    # Status
    is_active = models.BooleanField(default=True)
    is_accepting_orders = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name


class RestaurantStaff(models.Model):
    """
    Staff members for the restaurant within the tenant
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='staff')
    role = models.CharField(
        max_length=20,
        choices=[
            ('owner', 'Owner'),
            ('manager', 'Manager'),
            ('staff', 'Staff'),
            ('chef', 'Chef'),
        ],
        default='staff'
    )
    phone = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.restaurant.name}"

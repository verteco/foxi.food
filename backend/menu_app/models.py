from django.db import models
from restaurant_app.models import Restaurant


class Category(models.Model):
    """
    Food categories (e.g., Appetizers, Main Courses, Desserts)
    """
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='category_images/', blank=True, null=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['sort_order', 'name']
    
    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"


class MenuItem(models.Model):
    """
    Individual menu items
    """
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='menu_items')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to='menu_items/', blank=True, null=True)
    
    # Additional details
    ingredients = models.TextField(blank=True, help_text="List of ingredients")
    allergens = models.CharField(max_length=200, blank=True, help_text="Common allergens")
    preparation_time = models.PositiveIntegerField(default=15, help_text="Time in minutes")
    calories = models.PositiveIntegerField(blank=True, null=True)
    
    # Dietary options
    is_vegetarian = models.BooleanField(default=False)
    is_vegan = models.BooleanField(default=False)
    is_gluten_free = models.BooleanField(default=False)
    is_spicy = models.BooleanField(default=False)
    
    # Availability
    is_available = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['category', 'sort_order', 'name']
    
    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"


class MenuItemVariation(models.Model):
    """
    Variations of menu items (e.g., sizes, add-ons)
    """
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name='variations')
    name = models.CharField(max_length=50)  # e.g., "Small", "Large", "Extra Cheese"
    price_adjustment = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    is_available = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.menu_item.name} - {self.name}"

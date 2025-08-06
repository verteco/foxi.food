#!/usr/bin/env python
"""
Script to create test restaurant data for the Foxi Food application
"""

import os
import sys
import django

# Add the project directory to the path
sys.path.append('/Users/ondrejhanisch/CascadeProjects/foxi.food/backend')

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'foxi_food_backend.settings')
django.setup()

from restaurant_app.models import Restaurant
from menu_app.models import Category, MenuItem


def create_test_restaurants():
    """Create test restaurant data"""
    
    # Clear existing data
    Restaurant.objects.all().delete()
    Category.objects.all().delete()
    MenuItem.objects.all().delete()
    
    print("Creating test restaurants...")
    
    # Restaurant 1: Pizza Palace
    pizza_palace = Restaurant.objects.create(
        name="Pizza Palace",
        description="Authentic Italian pizzas made with fresh ingredients and traditional recipes. Our wood-fired oven ensures the perfect crispy crust every time.",
        address="123 Main Street, Downtown",
        phone="+1-555-0101",
        email="info@pizzapalace.com",
        cuisine_type="Italian",
        delivery_fee=2.99,
        minimum_order=15.00,
        delivery_radius=8,
        is_active=True,
        is_accepting_orders=True
    )
    
    # Restaurant 2: Burger Haven
    burger_haven = Restaurant.objects.create(
        name="Burger Haven",
        description="Juicy gourmet burgers, crispy fries, and milkshakes. We use only premium beef and fresh local ingredients for the ultimate burger experience.",
        address="456 Oak Avenue, Midtown",
        phone="+1-555-0102",
        email="orders@burgerhaven.com",
        cuisine_type="American",
        delivery_fee=3.49,
        minimum_order=12.00,
        delivery_radius=6,
        is_active=True,
        is_accepting_orders=True
    )
    
    # Restaurant 3: Sushi Zen
    sushi_zen = Restaurant.objects.create(
        name="Sushi Zen",
        description="Fresh sushi and sashimi prepared by experienced chefs. Traditional Japanese cuisine with a modern twist in a peaceful atmosphere.",
        address="789 Cherry Blossom Lane, Uptown",
        phone="+1-555-0103",
        email="hello@sushizen.com",
        cuisine_type="Japanese",
        delivery_fee=4.99,
        minimum_order=20.00,
        delivery_radius=10,
        is_active=True,
        is_accepting_orders=True
    )
    
    # Restaurant 4: Taco Fiesta
    taco_fiesta = Restaurant.objects.create(
        name="Taco Fiesta",
        description="Vibrant Mexican flavors with authentic tacos, burritos, and quesadillas. Made with fresh ingredients and traditional spices.",
        address="321 Sunset Boulevard, Westside",
        phone="+1-555-0104",
        email="orders@tacofiesta.com",
        cuisine_type="Mexican",
        delivery_fee=2.49,
        minimum_order=10.00,
        delivery_radius=5,
        is_active=True,
        is_accepting_orders=True
    )
    
    # Restaurant 5: Green Garden Cafe
    green_garden = Restaurant.objects.create(
        name="Green Garden Cafe",
        description="Healthy vegetarian and vegan options with fresh salads, smoothie bowls, and plant-based proteins. Organic and locally sourced ingredients.",
        address="555 Garden Street, Greenwood",
        phone="+1-555-0105",
        email="info@greengardencafe.com",
        cuisine_type="Vegetarian",
        delivery_fee=3.99,
        minimum_order=18.00,
        delivery_radius=7,
        is_active=True,
        is_accepting_orders=True
    )
    
    # Restaurant 6: Dragon Palace
    dragon_palace = Restaurant.objects.create(
        name="Dragon Palace",
        description="Authentic Chinese cuisine with traditional dishes and modern interpretations. Featuring dim sum, stir-fries, and specialty noodles.",
        address="888 Golden Dragon Road, Chinatown",
        phone="+1-555-0106",
        email="orders@dragonpalace.com",
        cuisine_type="Chinese",
        delivery_fee=3.29,
        minimum_order=16.00,
        delivery_radius=12,
        is_active=True,
        is_accepting_orders=True
    )
    
    print(f"Created {Restaurant.objects.count()} test restaurants successfully!")
    
    # Print restaurant details
    for restaurant in Restaurant.objects.all():
        print(f"- {restaurant.name} (Slug: {restaurant.slug})")
        print(f"  Cuisine: {restaurant.cuisine_type}")
        print(f"  Delivery: ${restaurant.delivery_fee} (Min: ${restaurant.minimum_order})")
        print(f"  Delivery Radius: {restaurant.delivery_radius}km")
        print()


if __name__ == "__main__":
    create_test_restaurants()

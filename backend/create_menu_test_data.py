#!/usr/bin/env python
"""
Script to create test menu data (categories and menu items) for restaurants
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


def create_menu_data():
    """Create test menu data for all restaurants"""
    
    print("Creating test menu data...")
    
    # Get all restaurants
    restaurants = Restaurant.objects.all()
    
    if not restaurants.exists():
        print("No restaurants found! Please create restaurants first.")
        return
    
    # Clear existing menu data
    Category.objects.all().delete()
    MenuItem.objects.all().delete()
    
    for restaurant in restaurants:
        print(f"\nCreating menu for {restaurant.name}...")
        
        if restaurant.cuisine_type == "Italian":
            create_italian_menu(restaurant)
        elif restaurant.cuisine_type == "American":
            create_american_menu(restaurant)
        elif restaurant.cuisine_type == "Japanese":
            create_japanese_menu(restaurant)
        elif restaurant.cuisine_type == "Mexican":
            create_mexican_menu(restaurant)
        elif restaurant.cuisine_type == "Vegetarian":
            create_vegetarian_menu(restaurant)
        elif restaurant.cuisine_type == "Chinese":
            create_chinese_menu(restaurant)
        else:
            create_generic_menu(restaurant)
    
    print(f"\nCreated menu data for {restaurants.count()} restaurants:")
    print(f"Total categories: {Category.objects.count()}")
    print(f"Total menu items: {MenuItem.objects.count()}")


def create_italian_menu(restaurant):
    """Create Italian menu for Pizza Palace"""
    # Appetizers
    appetizers = Category.objects.create(
        restaurant=restaurant,
        name="Appetizers",
        description="Start your meal with our delicious appetizers",
        sort_order=1
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=appetizers,
        name="Bruschetta", description="Toasted bread with tomatoes, garlic, and herbs",
        price=8.99, preparation_time=10, is_vegetarian=True
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=appetizers,
        name="Garlic Bread", description="Fresh bread with garlic butter and herbs",
        price=6.99, preparation_time=8, is_vegetarian=True
    )
    
    # Pizzas
    pizzas = Category.objects.create(
        restaurant=restaurant,
        name="Pizzas",
        description="Wood-fired pizzas with fresh ingredients",
        sort_order=2
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=pizzas,
        name="Margherita", description="Tomato sauce, mozzarella, fresh basil",
        price=14.99, preparation_time=20, is_vegetarian=True
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=pizzas,
        name="Pepperoni", description="Tomato sauce, mozzarella, pepperoni",
        price=16.99, preparation_time=20
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=pizzas,
        name="Quattro Stagioni", description="Four seasons pizza with ham, mushrooms, artichokes, olives",
        price=18.99, preparation_time=25
    )


def create_american_menu(restaurant):
    """Create American menu for Burger Haven"""
    # Burgers
    burgers = Category.objects.create(
        restaurant=restaurant,
        name="Burgers",
        description="Juicy gourmet burgers made with premium beef",
        sort_order=1
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=burgers,
        name="Classic Cheeseburger", description="Beef patty, cheese, lettuce, tomato, onion",
        price=12.99, preparation_time=15
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=burgers,
        name="BBQ Bacon Burger", description="Beef patty, bacon, BBQ sauce, onion rings",
        price=15.99, preparation_time=18
    )
    
    # Sides
    sides = Category.objects.create(
        restaurant=restaurant,
        name="Sides",
        description="Perfect sides to complete your meal",
        sort_order=2
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=sides,
        name="French Fries", description="Crispy golden fries",
        price=4.99, preparation_time=8, is_vegetarian=True
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=sides,
        name="Onion Rings", description="Beer-battered onion rings",
        price=5.99, preparation_time=10, is_vegetarian=True
    )


def create_japanese_menu(restaurant):
    """Create Japanese menu for Sushi Zen"""
    # Sushi Rolls
    sushi = Category.objects.create(
        restaurant=restaurant,
        name="Sushi Rolls",
        description="Fresh sushi rolls made to order",
        sort_order=1
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=sushi,
        name="California Roll", description="Crab, avocado, cucumber",
        price=8.99, preparation_time=15
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=sushi,
        name="Salmon Avocado Roll", description="Fresh salmon and avocado",
        price=9.99, preparation_time=15
    )
    
    # Sashimi
    sashimi = Category.objects.create(
        restaurant=restaurant,
        name="Sashimi",
        description="Fresh sliced fish without rice",
        sort_order=2
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=sashimi,
        name="Salmon Sashimi", description="6 pieces of fresh salmon",
        price=12.99, preparation_time=10
    )


def create_mexican_menu(restaurant):
    """Create Mexican menu for Taco Fiesta"""
    # Tacos
    tacos = Category.objects.create(
        restaurant=restaurant,
        name="Tacos",
        description="Authentic Mexican tacos",
        sort_order=1
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=tacos,
        name="Beef Tacos", description="Seasoned ground beef with lettuce, cheese, tomato",
        price=3.99, preparation_time=8, is_spicy=True
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=tacos,
        name="Chicken Tacos", description="Grilled chicken with cilantro and onion",
        price=3.99, preparation_time=8
    )
    
    # Burritos
    burritos = Category.objects.create(
        restaurant=restaurant,
        name="Burritos",
        description="Large flour tortillas filled with your favorites",
        sort_order=2
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=burritos,
        name="Bean Burrito", description="Refried beans, rice, cheese, lettuce",
        price=8.99, preparation_time=12, is_vegetarian=True
    )


def create_vegetarian_menu(restaurant):
    """Create Vegetarian menu for Green Garden Cafe"""
    # Salads
    salads = Category.objects.create(
        restaurant=restaurant,
        name="Fresh Salads",
        description="Organic and locally sourced fresh salads",
        sort_order=1
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=salads,
        name="Rainbow Bowl", description="Mixed greens, quinoa, chickpeas, vegetables",
        price=12.99, preparation_time=10, is_vegetarian=True, is_vegan=True
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=salads,
        name="Greek Salad", description="Tomatoes, cucumber, olives, feta cheese",
        price=10.99, preparation_time=8, is_vegetarian=True
    )
    
    # Smoothies
    smoothies = Category.objects.create(
        restaurant=restaurant,
        name="Smoothies",
        description="Fresh fruit and vegetable smoothies",
        sort_order=2
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=smoothies,
        name="Green Power", description="Spinach, apple, banana, ginger",
        price=7.99, preparation_time=5, is_vegetarian=True, is_vegan=True
    )


def create_chinese_menu(restaurant):
    """Create Chinese menu for Dragon Palace"""
    # Main Dishes
    mains = Category.objects.create(
        restaurant=restaurant,
        name="Main Dishes",
        description="Traditional Chinese main courses",
        sort_order=1
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=mains,
        name="Sweet & Sour Pork", description="Battered pork with pineapple and bell peppers",
        price=14.99, preparation_time=20
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=mains,
        name="Kung Pao Chicken", description="Spicy chicken with peanuts and vegetables",
        price=13.99, preparation_time=18, is_spicy=True
    )
    
    # Noodles
    noodles = Category.objects.create(
        restaurant=restaurant,
        name="Noodles",
        description="Fresh noodle dishes",
        sort_order=2
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=noodles,
        name="Lo Mein", description="Soft noodles with vegetables and choice of protein",
        price=11.99, preparation_time=15
    )


def create_generic_menu(restaurant):
    """Create generic menu for other restaurants"""
    # Starters
    starters = Category.objects.create(
        restaurant=restaurant,
        name="Starters",
        description="Delicious appetizers to start your meal",
        sort_order=1
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=starters,
        name="House Special", description="Chef's recommended starter",
        price=8.99, preparation_time=12
    )
    
    # Main Course
    mains = Category.objects.create(
        restaurant=restaurant,
        name="Main Course",
        description="Hearty main dishes",
        sort_order=2
    )
    
    MenuItem.objects.create(
        restaurant=restaurant, category=mains,
        name="Signature Dish", description="Our restaurant's signature dish",
        price=16.99, preparation_time=25
    )


if __name__ == "__main__":
    create_menu_data()

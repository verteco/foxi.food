#!/usr/bin/env python
"""
Script to create test order data for the food ordering platform
"""

import os
import sys
import django
from decimal import Decimal

# Add the project directory to the path
sys.path.append('/Users/ondrejhanisch/CascadeProjects/foxi.food/backend')

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'foxi_food_backend.settings')
django.setup()

from restaurant_app.models import Restaurant
from menu_app.models import MenuItem, Category
from order_app.models import Customer, Order, OrderItem
import uuid


def create_test_orders():
    """Create test orders with sample data"""
    
    print("Creating test order data...")
    
    # Clear existing order data
    Order.objects.all().delete()
    Customer.objects.all().delete()
    
    # Get restaurants and menu items
    restaurants = list(Restaurant.objects.all())
    if not restaurants:
        print("No restaurants found! Please create restaurants first.")
        return
    
    # Create test customers
    customers_data = [
        {
            'name': 'John Smith',
            'email': 'john@example.com',
            'phone': '+1-555-1001',
            'address': '123 Main St, Downtown'
        },
        {
            'name': 'Sarah Johnson',
            'email': 'sarah@example.com', 
            'phone': '+1-555-1002',
            'address': '456 Oak Ave, Midtown'
        },
        {
            'name': 'Mike Wilson',
            'email': 'mike@example.com',
            'phone': '+1-555-1003',
            'address': '789 Pine Rd, Uptown'
        }
    ]
    
    customers = []
    for customer_data in customers_data:
        customer = Customer.objects.create(**customer_data)
        customers.append(customer)
    
    print(f"Created {len(customers)} test customers")
    
    # Create test orders
    orders_created = 0
    
    # Order 1: Pizza Palace order
    pizza_palace = Restaurant.objects.filter(name="Pizza Palace").first()
    if pizza_palace:
        pizza_items = MenuItem.objects.filter(restaurant=pizza_palace, is_available=True)
        if pizza_items.exists():
            order1 = Order.objects.create(
                restaurant=pizza_palace,
                customer=customers[0],
                order_number=generate_order_number(),
                status='confirmed',
                payment_status='paid',
                subtotal=Decimal('25.98'),
                delivery_fee=pizza_palace.delivery_fee,
                total_amount=Decimal('28.97'),
                delivery_address=customers[0].address,
                delivery_phone=customers[0].phone,
                delivery_notes='Ring doorbell twice'
            )
            
            # Add pizza items to order
            margherita = pizza_items.filter(name="Margherita").first()
            if margherita:
                OrderItem.objects.create(
                    order=order1,
                    menu_item=margherita,
                    quantity=1,
                    unit_price=margherita.price,
                    total_price=margherita.price,
                    special_instructions="Extra basil please"
                )
            
            bruschetta = pizza_items.filter(name="Bruschetta").first()
            if bruschetta:
                OrderItem.objects.create(
                    order=order1,
                    menu_item=bruschetta,
                    quantity=2,
                    unit_price=bruschetta.price,
                    total_price=bruschetta.price * 2
                )
            
            orders_created += 1
            print(f"Created Pizza Palace order: {order1.order_number}")
    
    # Order 2: Sushi Zen order
    sushi_zen = Restaurant.objects.filter(name="Sushi Zen").first()
    if sushi_zen:
        sushi_items = MenuItem.objects.filter(restaurant=sushi_zen, is_available=True)
        if sushi_items.exists():
            order2 = Order.objects.create(
                restaurant=sushi_zen,
                customer=customers[1],
                order_number=generate_order_number(),
                status='preparing',
                payment_status='paid',
                subtotal=Decimal('21.98'),
                delivery_fee=sushi_zen.delivery_fee,
                total_amount=Decimal('26.97'),
                delivery_address=customers[1].address,
                delivery_phone=customers[1].phone
            )
            
            # Add sushi items to order
            california_roll = sushi_items.filter(name="California Roll").first()
            if california_roll:
                OrderItem.objects.create(
                    order=order2,
                    menu_item=california_roll,
                    quantity=2,
                    unit_price=california_roll.price,
                    total_price=california_roll.price * 2
                )
            
            salmon_sashimi = sushi_items.filter(name="Salmon Sashimi").first()
            if salmon_sashimi:
                OrderItem.objects.create(
                    order=order2,
                    menu_item=salmon_sashimi,
                    quantity=1,
                    unit_price=salmon_sashimi.price,
                    total_price=salmon_sashimi.price
                )
            
            orders_created += 1
            print(f"Created Sushi Zen order: {order2.order_number}")
    
    # Order 3: Burger Haven order
    burger_haven = Restaurant.objects.filter(name="Burger Haven").first()
    if burger_haven:
        burger_items = MenuItem.objects.filter(restaurant=burger_haven, is_available=True)
        if burger_items.exists():
            order3 = Order.objects.create(
                restaurant=burger_haven,
                customer=customers[2],
                order_number=generate_order_number(),
                status='delivered',
                payment_status='paid',
                subtotal=Decimal('18.98'),
                delivery_fee=burger_haven.delivery_fee,
                total_amount=Decimal('22.47'),
                delivery_address=customers[2].address,
                delivery_phone=customers[2].phone,
                delivery_notes='Leave at front door'
            )
            
            # Add burger items to order
            bbq_burger = burger_items.filter(name="BBQ Bacon Burger").first()
            if bbq_burger:
                OrderItem.objects.create(
                    order=order3,
                    menu_item=bbq_burger,
                    quantity=1,
                    unit_price=bbq_burger.price,
                    total_price=bbq_burger.price,
                    special_instructions="Medium rare, no onions"
                )
            
            fries = burger_items.filter(name="French Fries").first()
            if fries:
                OrderItem.objects.create(
                    order=order3,
                    menu_item=fries,
                    quantity=1,
                    unit_price=fries.price,
                    total_price=fries.price
                )
            
            orders_created += 1
            print(f"Created Burger Haven order: {order3.order_number}")
    
    print(f"\nCreated {orders_created} test orders successfully!")
    print(f"Total customers: {Customer.objects.count()}")
    print(f"Total orders: {Order.objects.count()}")
    print(f"Total order items: {OrderItem.objects.count()}")
    
    # Show order summary
    print("\nOrder Summary:")
    for order in Order.objects.all().order_by('-created_at'):
        print(f"- {order.order_number}: {order.restaurant.name} - {order.status.title()} - ${order.total_amount}")


def generate_order_number():
    """Generate a unique order number"""
    return str(uuid.uuid4())[:8].upper()


if __name__ == "__main__":
    create_test_orders()

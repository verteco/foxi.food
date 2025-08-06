from rest_framework import serializers
from .models import Customer, Order, OrderItem


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'name', 'email', 'phone', 'address', 'created_at']
        read_only_fields = ['id', 'created_at']


class OrderItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='menu_item.name', read_only=True)
    item_price = serializers.CharField(source='menu_item.price', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'item_name', 'item_price', 'quantity', 'unit_price', 'total_price', 'special_instructions']
        read_only_fields = ['id', 'item_name', 'item_price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer', 'customer_name', 'restaurant', 'restaurant_name',
            'status', 'total_amount', 'delivery_address', 'delivery_phone', 'delivery_notes',
            'created_at', 'updated_at', 'items'
        ]
        read_only_fields = ['id', 'order_number', 'customer_name', 'restaurant_name', 'items']


class OrderCreateSerializer(serializers.ModelSerializer):
    customer_data = serializers.JSONField(write_only=True)
    items_data = serializers.JSONField(write_only=True)
    
    class Meta:
        model = Order
        fields = [
            'restaurant', 'delivery_address', 'delivery_phone', 'delivery_notes',
            'customer_data', 'items_data'
        ]

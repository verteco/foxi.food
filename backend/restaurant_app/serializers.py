from rest_framework import serializers
from .models import Restaurant, RestaurantStaff
from menu_app.models import Category, MenuItem, MenuItemVariation


class MenuItemVariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItemVariation
        fields = ['id', 'name', 'price_adjustment', 'is_available']


class MenuItemSerializer(serializers.ModelSerializer):
    variations = MenuItemVariationSerializer(many=True, read_only=True)
    
    class Meta:
        model = MenuItem
        fields = [
            'id', 'name', 'description', 'price', 'image', 
            'is_available', 'is_vegetarian', 'is_vegan', 'is_gluten_free',
            'variations'
        ]


class CategorySerializer(serializers.ModelSerializer):
    items = MenuItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'items', 'is_active']


class RestaurantListSerializer(serializers.ModelSerializer):
    """Serializer for restaurant list view (minimal data)"""
    
    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'slug', 'description', 'cuisine_type', 
            'delivery_fee', 'minimum_order', 'logo', 'cover_image',
            'is_active', 'is_accepting_orders'
        ]


class RestaurantDetailSerializer(serializers.ModelSerializer):
    """Serializer for restaurant detail view (with menu)"""
    categories = CategorySerializer(many=True, read_only=True)
    
    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'slug', 'description', 'address', 'phone', 'email',
            'website', 'cuisine_type', 'opening_hours', 'delivery_fee',
            'minimum_order', 'delivery_radius', 'logo', 'cover_image',
            'is_active', 'is_accepting_orders', 'categories'
        ]


class RestaurantStaffSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = RestaurantStaff
        fields = [
            'id', 'user_email', 'user_name', 'role', 'phone', 
            'is_active', 'created_at'
        ]

from rest_framework import serializers
from .models import Category, MenuItem, MenuItemVariation


class MenuItemVariationSerializer(serializers.ModelSerializer):
    """
    Serializer for menu item variations (e.g., sizes, add-ons)
    """
    class Meta:
        model = MenuItemVariation
        fields = [
            'id', 'name', 'price_adjustment', 'is_available'
        ]


class MenuItemListSerializer(serializers.ModelSerializer):
    """
    Serializer for menu item list view (minimal data)
    """
    variations = MenuItemVariationSerializer(many=True, read_only=True)
    
    class Meta:
        model = MenuItem
        fields = [
            'id', 'name', 'description', 'price', 'image',
            'is_vegetarian', 'is_vegan', 'is_gluten_free', 'is_spicy',
            'is_available', 'preparation_time', 'variations'
        ]


class MenuItemDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for menu item detail view (full data)
    """
    variations = MenuItemVariationSerializer(many=True, read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = MenuItem
        fields = [
            'id', 'restaurant', 'restaurant_name', 'category', 'category_name',
            'name', 'description', 'price', 'image', 'ingredients', 'allergens',
            'preparation_time', 'calories', 'is_vegetarian', 'is_vegan',
            'is_gluten_free', 'is_spicy', 'is_available', 'sort_order',
            'created_at', 'updated_at', 'variations'
        ]


class CategoryListSerializer(serializers.ModelSerializer):
    """
    Serializer for category list view
    """
    items_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'description', 'image', 'sort_order',
            'is_active', 'items_count'
        ]
    
    def get_items_count(self, obj):
        return obj.items.filter(is_available=True).count()


class CategoryDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for category detail view with menu items
    """
    items = MenuItemListSerializer(many=True, read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    items_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'restaurant', 'restaurant_name', 'name', 'description',
            'image', 'sort_order', 'is_active', 'created_at', 'updated_at',
            'items_count', 'items'
        ]
    
    def get_items_count(self, obj):
        return obj.items.filter(is_available=True).count()


class MenuItemCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating menu items
    """
    class Meta:
        model = MenuItem
        fields = [
            'restaurant', 'category', 'name', 'description', 'price',
            'image', 'ingredients', 'allergens', 'preparation_time',
            'calories', 'is_vegetarian', 'is_vegan', 'is_gluten_free',
            'is_spicy', 'is_available', 'sort_order'
        ]
    
    def validate(self, data):
        # Ensure category belongs to the same restaurant
        if data.get('category') and data.get('restaurant'):
            if data['category'].restaurant != data['restaurant']:
                raise serializers.ValidationError(
                    "Category must belong to the same restaurant."
                )
        return data


class CategoryCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating categories
    """
    class Meta:
        model = Category
        fields = [
            'restaurant', 'name', 'description', 'image',
            'sort_order', 'is_active'
        ]

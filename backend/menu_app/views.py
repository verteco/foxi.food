from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from restaurant_app.models import Restaurant
from .models import Category, MenuItem, MenuItemVariation
from .serializers import (
    CategoryListSerializer, CategoryDetailSerializer, CategoryCreateUpdateSerializer,
    MenuItemListSerializer, MenuItemDetailSerializer, MenuItemCreateUpdateSerializer,
    MenuItemVariationSerializer
)


# ===== CATEGORY VIEWS =====

class CategoryListView(generics.ListAPIView):
    """
    API endpoint for listing categories for a specific restaurant
    """
    serializer_class = CategoryListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['sort_order', 'name', 'created_at']
    ordering = ['sort_order', 'name']
    
    def get_queryset(self):
        restaurant_slug = self.kwargs.get('restaurant_slug')
        restaurant = get_object_or_404(Restaurant, slug=restaurant_slug, is_active=True)
        return Category.objects.filter(restaurant=restaurant, is_active=True)


class CategoryDetailView(generics.RetrieveAPIView):
    """
    API endpoint for retrieving a single category with its menu items
    """
    serializer_class = CategoryDetailSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        restaurant_slug = self.kwargs.get('restaurant_slug')
        restaurant = get_object_or_404(Restaurant, slug=restaurant_slug, is_active=True)
        return Category.objects.filter(restaurant=restaurant, is_active=True)


class CategoryCreateView(generics.CreateAPIView):
    """
    API endpoint for creating a new category
    """
    queryset = Category.objects.all()
    serializer_class = CategoryCreateUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        restaurant_slug = self.kwargs.get('restaurant_slug')
        restaurant = get_object_or_404(Restaurant, slug=restaurant_slug)
        serializer.save(restaurant=restaurant)


class CategoryUpdateView(generics.RetrieveUpdateAPIView):
    """
    API endpoint for updating an existing category
    """
    serializer_class = CategoryCreateUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        restaurant_slug = self.kwargs.get('restaurant_slug')
        restaurant = get_object_or_404(Restaurant, slug=restaurant_slug)
        return Category.objects.filter(restaurant=restaurant)


class CategoryDeleteView(generics.DestroyAPIView):
    """
    API endpoint for deleting a category (soft delete)
    """
    serializer_class = CategoryDetailSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        restaurant_slug = self.kwargs.get('restaurant_slug')
        restaurant = get_object_or_404(Restaurant, slug=restaurant_slug)
        return Category.objects.filter(restaurant=restaurant)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Soft delete: set is_active to False
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ===== MENU ITEM VIEWS =====

class MenuItemListView(generics.ListAPIView):
    """
    API endpoint for listing menu items for a specific restaurant or category
    """
    serializer_class = MenuItemListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_vegetarian', 'is_vegan', 'is_gluten_free', 'is_spicy', 'is_available']
    search_fields = ['name', 'description', 'ingredients']
    ordering_fields = ['name', 'price', 'preparation_time', 'sort_order']
    ordering = ['sort_order', 'name']
    
    def get_queryset(self):
        restaurant_slug = self.kwargs.get('restaurant_slug')
        restaurant = get_object_or_404(Restaurant, slug=restaurant_slug, is_active=True)
        
        queryset = MenuItem.objects.filter(restaurant=restaurant, is_available=True)
        
        # Filter by category if provided
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
            
        return queryset


class MenuItemDetailView(generics.RetrieveAPIView):
    """
    API endpoint for retrieving a single menu item with full details
    """
    serializer_class = MenuItemDetailSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        restaurant_slug = self.kwargs.get('restaurant_slug')
        restaurant = get_object_or_404(Restaurant, slug=restaurant_slug, is_active=True)
        return MenuItem.objects.filter(restaurant=restaurant, is_available=True)


class MenuItemCreateView(generics.CreateAPIView):
    """
    API endpoint for creating a new menu item
    """
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemCreateUpdateSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def perform_create(self, serializer):
        restaurant_slug = self.kwargs.get('restaurant_slug')
        restaurant = get_object_or_404(Restaurant, slug=restaurant_slug)
        serializer.save(restaurant=restaurant)


class MenuItemUpdateView(generics.RetrieveUpdateAPIView):
    """
    API endpoint for updating an existing menu item
    """
    serializer_class = MenuItemCreateUpdateSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        restaurant_slug = self.kwargs.get('restaurant_slug')
        restaurant = get_object_or_404(Restaurant, slug=restaurant_slug)
        return MenuItem.objects.filter(restaurant=restaurant)


class MenuItemDeleteView(generics.DestroyAPIView):
    """
    API endpoint for deleting a menu item (soft delete)
    """
    serializer_class = MenuItemDetailSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        restaurant_slug = self.kwargs.get('restaurant_slug')
        restaurant = get_object_or_404(Restaurant, slug=restaurant_slug)
        return MenuItem.objects.filter(restaurant=restaurant)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Soft delete: set is_available to False
        instance.is_available = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MenuItemImageUploadView(generics.UpdateAPIView):
    """
    API endpoint for uploading menu item images
    """
    serializer_class = MenuItemDetailSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        restaurant_slug = self.kwargs.get('restaurant_slug')
        restaurant = get_object_or_404(Restaurant, slug=restaurant_slug)
        return MenuItem.objects.filter(restaurant=restaurant)
    
    def patch(self, request, *args, **kwargs):
        menu_item = self.get_object()
        if 'image' in request.FILES:
            menu_item.image = request.FILES['image']
            menu_item.save()
            serializer = self.get_serializer(menu_item)
            return Response(serializer.data)
        return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)


# ===== RESTAURANT MENU OVERVIEW =====

@api_view(['GET'])
@permission_classes([AllowAny])
def restaurant_menu_overview(request, restaurant_slug):
    """
    API endpoint for complete restaurant menu overview
    """
    restaurant = get_object_or_404(Restaurant, slug=restaurant_slug, is_active=True)
    
    categories = Category.objects.filter(
        restaurant=restaurant, 
        is_active=True
    ).prefetch_related('items')
    
    menu_data = []
    for category in categories:
        available_items = category.items.filter(is_available=True)
        category_data = {
            'id': category.id,
            'name': category.name,
            'description': category.description,
            'image': category.image.url if category.image else None,
            'sort_order': category.sort_order,
            'items_count': available_items.count(),
            'items': MenuItemListSerializer(available_items, many=True).data
        }
        menu_data.append(category_data)
    
    return Response({
        'restaurant': {
            'id': restaurant.id,
            'name': restaurant.name,
            'slug': restaurant.slug,
            'cuisine_type': restaurant.cuisine_type
        },
        'categories': menu_data,
        'total_categories': len(menu_data),
        'total_items': sum(cat['items_count'] for cat in menu_data)
    })

from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from django.http import Http404
from .models import Restaurant, RestaurantStaff
from .serializers import RestaurantListSerializer, RestaurantDetailSerializer, RestaurantStaffSerializer


class RestaurantListView(generics.ListAPIView):
    """
    API endpoint for listing all restaurants
    Supports filtering by cuisine_type and search by name
    """
    queryset = Restaurant.objects.filter(is_active=True)
    serializer_class = RestaurantListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['cuisine_type', 'is_accepting_orders']
    search_fields = ['name', 'description', 'cuisine_type']
    ordering_fields = ['name', 'delivery_fee', 'minimum_order']
    ordering = ['name']


class RestaurantDetailView(generics.RetrieveAPIView):
    """
    API endpoint for retrieving a single restaurant with full menu
    """
    queryset = Restaurant.objects.filter(is_active=True)
    serializer_class = RestaurantDetailSerializer
    permission_classes = [AllowAny]


class RestaurantDetailBySlugView(generics.RetrieveAPIView):
    """
    API endpoint for retrieving a single restaurant by slug with full menu
    """
    queryset = Restaurant.objects.filter(is_active=True)
    serializer_class = RestaurantDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class RestaurantCreateView(generics.CreateAPIView):
    """
    API endpoint for creating a new restaurant
    """
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantDetailSerializer
    permission_classes = [IsAuthenticated]


class RestaurantUpdateView(generics.RetrieveUpdateAPIView):
    """
    API endpoint for updating an existing restaurant
    """
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'


class RestaurantDeleteView(generics.DestroyAPIView):
    """
    API endpoint for deleting a restaurant (soft delete by setting is_active=False)
    """
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Soft delete: set is_active to False instead of hard delete
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RestaurantLogoUploadView(generics.UpdateAPIView):
    """
    API endpoint for uploading restaurant logo
    """
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantDetailSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    lookup_field = 'slug'
    
    def patch(self, request, *args, **kwargs):
        restaurant = self.get_object()
        if 'logo' in request.FILES:
            restaurant.logo = request.FILES['logo']
            restaurant.save()
            serializer = self.get_serializer(restaurant)
            return Response(serializer.data)
        return Response({'error': 'No logo file provided'}, status=status.HTTP_400_BAD_REQUEST)


class RestaurantCoverUploadView(generics.UpdateAPIView):
    """
    API endpoint for uploading restaurant cover image
    """
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantDetailSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    lookup_field = 'slug'
    
    def patch(self, request, *args, **kwargs):
        restaurant = self.get_object()
        if 'cover_image' in request.FILES:
            restaurant.cover_image = request.FILES['cover_image']
            restaurant.save()
            serializer = self.get_serializer(restaurant)
            return Response(serializer.data)
        return Response({'error': 'No cover image file provided'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def restaurant_stats(request):
    """
    API endpoint for restaurant statistics
    """
    total_restaurants = Restaurant.objects.filter(is_active=True).count()
    open_restaurants = Restaurant.objects.filter(is_active=True, is_accepting_orders=True).count()
    cuisine_types = Restaurant.objects.filter(is_active=True).values_list('cuisine_type', flat=True).distinct()
    
    return Response({
        'total_restaurants': total_restaurants,
        'open_restaurants': open_restaurants,
        'cuisine_types': list(cuisine_types)
    })

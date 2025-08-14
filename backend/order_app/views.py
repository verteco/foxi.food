from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils import timezone
from django.shortcuts import get_object_or_404
import uuid

from .models import Customer, Order, OrderItem
from .serializers import CustomerSerializer, OrderSerializer, OrderCreateSerializer, OrderItemSerializer
from menu_app.models import MenuItem
from restaurant_app.models import Restaurant


class OrderListCreateView(generics.ListCreateAPIView):
    """API view for listing and creating orders"""
    queryset = Order.objects.all().order_by('-created_at')
    permission_classes = [AllowAny]  # For demo purposes, remove in production
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return OrderCreateSerializer
        return OrderSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Extract data
        customer_data = serializer.validated_data.pop('customer_data')
        items_data = serializer.validated_data.pop('items_data')
        
        # Create or get customer
        customer, created = Customer.objects.get_or_create(
            email=customer_data['email'],
            defaults={
                'name': customer_data['name'],
                'phone': customer_data['phone'],
                'address': customer_data['address']
            }
        )
        
        # Create order
        order = Order.objects.create(
            customer=customer,
            order_number=str(uuid.uuid4())[:8].upper(),
            **serializer.validated_data
        )
        
        # Create order items
        total_amount = 0
        for item_data in items_data:
            menu_item = MenuItem.objects.get(id=item_data['menu_item_id'])
            item_price = float(menu_item.price)
            quantity = item_data['quantity']
            
            OrderItem.objects.create(
                order=order,
                menu_item=menu_item,
                quantity=quantity,
                price=str(item_price),
                special_instructions=item_data.get('special_instructions', '')
            )
            
            total_amount += item_price * quantity
        
        # Update order total
        order.total_amount = str(total_amount)
        order.save()
        
        # Return created order
        response_serializer = OrderSerializer(order)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class OrderDetailView(generics.RetrieveUpdateAPIView):
    """API view for retrieving and updating individual orders"""
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]  # For demo purposes, remove in production


@api_view(['GET'])
@permission_classes([AllowAny])
def order_status(request, order_number):
    """
    Get order status by order number
    """
    try:
        order = Order.objects.get(order_number=order_number)
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Order.DoesNotExist:
        return Response(
            {'error': 'Order not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def restaurant_orders(request, restaurant_id):
    """
    Get all orders for a specific restaurant by ID
    """
    restaurant = get_object_or_404(Restaurant, id=restaurant_id, is_active=True)
    orders = Order.objects.filter(restaurant=restaurant).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response({
        'restaurant': {
            'id': restaurant.id,
            'name': restaurant.name,
            'slug': restaurant.slug
        },
        'orders': serializer.data,
        'total_orders': len(serializer.data)
    })

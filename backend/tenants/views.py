from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from .models import UserProfile
from restaurant_app.models import Restaurant, RestaurantStaff


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """API endpoint for user login"""
    email = request.data.get('email')
    password = request.data.get('password')
    user_type = request.data.get('user_type', 'customer')
    
    if not email or not password:
        return Response(
            {'error': 'Email a heslo sú povinné'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Find user by email
        user = User.objects.get(email=email)
        
        # Authenticate user
        authenticated_user = authenticate(username=user.username, password=password)
        
        if authenticated_user:
            # Get or create token
            token, created = Token.objects.get_or_create(user=authenticated_user)
            
            # Get user profile
            try:
                user_profile = UserProfile.objects.get(user=authenticated_user)
                
                # Check user type matches
                if user_type == 'restaurant' and user_profile.role != 'restaurant_owner':
                    return Response(
                        {'error': 'Nesprávny typ účtu'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                return Response({
                    'token': token.key,
                    'user': {
                        'id': authenticated_user.id,
                        'email': authenticated_user.email,
                        'name': f"{authenticated_user.first_name} {authenticated_user.last_name}".strip(),
                        'role': user_profile.role,
                        'restaurant_name': user_profile.restaurant_name if user_profile.role == 'restaurant_owner' else None
                    }
                })
                
            except UserProfile.DoesNotExist:
                return Response(
                    {'error': 'Profil používateľa neexistuje'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return Response(
                {'error': 'Nesprávne prihlasovacie údaje'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
    except User.DoesNotExist:
        return Response(
            {'error': 'Používateľ neexistuje'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def register_restaurant(request):
    """API endpoint for restaurant registration"""
    try:
        # Extract form data
        restaurant_name = request.data.get('restaurant_name')
        email = request.data.get('email')
        password = request.data.get('password')
        confirm_password = request.data.get('confirm_password')
        owner_name = request.data.get('owner_name')
        phone = request.data.get('phone')
        address = request.data.get('address')
        cuisine_type = request.data.get('cuisine_type')
        description = request.data.get('description', '')
        
        # Validate required fields
        required_fields = [restaurant_name, email, password, owner_name, phone, address, cuisine_type]
        if not all(required_fields):
            return Response(
                {'error': 'Všetky povinné polia musia byť vyplnené'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate password confirmation
        if password != confirm_password:
            return Response(
                {'error': 'Heslá sa nezhodujú'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Používateľ s týmto emailom už existuje'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create user
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=owner_name.split()[0] if owner_name.split() else owner_name,
            last_name=' '.join(owner_name.split()[1:]) if len(owner_name.split()) > 1 else ''
        )
        
        # Create user profile
        UserProfile.objects.create(
            user=user,
            role='restaurant_owner',
            restaurant_name=restaurant_name
        )
        
        # Create restaurant
        restaurant = Restaurant.objects.create(
            name=restaurant_name,
            description=description,
            address=address,
            phone=phone,
            email=email,
            cuisine_type=cuisine_type,
            is_active=True,
            is_accepting_orders=True
        )
        
        # Create restaurant staff relationship
        RestaurantStaff.objects.create(
            restaurant=restaurant,
            user=user,
            phone=phone
        )
        
        # Create authentication token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'message': 'Reštaurácia bola úspešne zaregistrovaná',
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': owner_name,
                'role': 'restaurant_owner',
                'restaurant_name': restaurant_name
            },
            'restaurant_id': restaurant.id
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': f'Chyba pri registrácii: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def logout_view(request):
    """API endpoint for user logout"""
    try:
        # Delete the user's token
        token = Token.objects.get(user=request.user)
        token.delete()
        return Response({'message': 'Odhlásenie úspešné'})
    except Token.DoesNotExist:
        return Response({'message': 'Odhlásenie úspešné'})


@api_view(['GET'])
def user_profile(request):
    """API endpoint to get current user profile"""
    try:
        user_profile = UserProfile.objects.get(user=request.user)
        return Response({
            'user': {
                'id': request.user.id,
                'email': request.user.email,
                'name': f"{request.user.first_name} {request.user.last_name}".strip(),
                'role': user_profile.role,
                'restaurant_name': user_profile.restaurant_name if user_profile.role == 'restaurant_owner' else None
            }
        })
    except UserProfile.DoesNotExist:
        return Response(
            {'error': 'Profil používateľa neexistuje'}, 
            status=status.HTTP_404_NOT_FOUND
        )

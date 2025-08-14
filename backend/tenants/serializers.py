from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'] = serializers.CharField(required=True)
        self.fields['password'] = serializers.CharField(required=True, write_only=True)
        self.fields.pop('username', None)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            try:
                user = User.objects.get(email=email)
                # Authenticate using the username from the found user
                user = authenticate(username=user.username, password=password)
                
                if not user:
                    raise serializers.ValidationError(
                        {'error': 'Neplatný email alebo heslo.'},
                        code='authorization'
                    )
            except User.DoesNotExist:
                raise serializers.ValidationError(
                    {'error': 'Používateľ s týmto emailom neexistuje.'},
                    code='authorization'
                )
        else:
            raise serializers.ValidationError(
                {'error': 'Email a heslo sú povinné.'},
                code='authorization'
            )
        
        if not user.is_active:
            raise serializers.ValidationError(
                {'error': 'Používateľský účet je deaktivovaný.'},
                code='authorization'
            )
        
        refresh = RefreshToken.for_user(user)
        
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
            }
        }

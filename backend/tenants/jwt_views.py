from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import EmailTokenObtainPairSerializer

class EmailTokenObtainPairView(TokenObtainPairView):
    """
    Takes an email and password pair and returns an access and refresh JSON web token pair
    to prove the authentication of those credentials.
    """
    serializer_class = EmailTokenObtainPairSerializer

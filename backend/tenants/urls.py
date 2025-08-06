from django.urls import path
from . import views

urlpatterns = [
    path('auth/login/', views.login_view, name='login'),
    path('auth/register-restaurant/', views.register_restaurant, name='register-restaurant'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/profile/', views.user_profile, name='user-profile'),
]

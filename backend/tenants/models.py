from django.db import models
from django.contrib.auth.models import User


class Client(models.Model):
    """
    Restaurant client model for local development
    (In production, this would use TenantMixin for multi-tenancy)
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='tenant_logos/', blank=True, null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name


class Domain(models.Model):
    """
    Domain model for restaurant domains
    (In production, this would use DomainMixin for multi-tenancy)
    """
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='domains')
    domain = models.CharField(max_length=100, unique=True)
    is_primary = models.BooleanField(default=False)
    
    def __str__(self):
        return self.domain


class UserProfile(models.Model):
    """
    User profile for restaurant staff - extends standard User model
    """
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(
        max_length=20,
        choices=[
            ('owner', 'Owner'),
            ('manager', 'Manager'), 
            ('staff', 'Staff'),
        ],
        default='staff'
    )
    restaurant_name = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.restaurant_name}"

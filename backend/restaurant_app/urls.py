from django.urls import path
from . import views

urlpatterns = [
    path('', views.RestaurantListView.as_view(), name='restaurant-list'),
    path('create/', views.RestaurantCreateView.as_view(), name='restaurant-create'),
    path('stats/', views.restaurant_stats, name='restaurant-stats'),
    path('<int:pk>/', views.RestaurantDetailView.as_view(), name='restaurant-detail'),
    path('<slug:slug>/', views.RestaurantDetailBySlugView.as_view(), name='restaurant-detail-slug'),
    path('<slug:slug>/edit/', views.RestaurantUpdateView.as_view(), name='restaurant-update'),
    path('<slug:slug>/delete/', views.RestaurantDeleteView.as_view(), name='restaurant-delete'),
    path('<slug:slug>/upload-logo/', views.RestaurantLogoUploadView.as_view(), name='restaurant-upload-logo'),
    path('<slug:slug>/upload-cover/', views.RestaurantCoverUploadView.as_view(), name='restaurant-upload-cover'),
]

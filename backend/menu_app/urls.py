from django.urls import path, re_path
from . import views

urlpatterns = [
    # Restaurant menu overview - support both slug and numeric ID
    path('restaurants/<slug:restaurant_slug>/menu/', views.restaurant_menu_overview, name='restaurant-menu-overview'),
    path('restaurants/<int:restaurant_id>/menu/', views.restaurant_menu_by_id, name='restaurant-menu-by-id'),
    
    # Category endpoints
    path('restaurants/<slug:restaurant_slug>/categories/', views.CategoryListView.as_view(), name='category-list'),
    path('restaurants/<slug:restaurant_slug>/categories/create/', views.CategoryCreateView.as_view(), name='category-create'),
    path('restaurants/<slug:restaurant_slug>/categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),
    path('restaurants/<slug:restaurant_slug>/categories/<int:pk>/edit/', views.CategoryUpdateView.as_view(), name='category-update'),
    path('restaurants/<slug:restaurant_slug>/categories/<int:pk>/delete/', views.CategoryDeleteView.as_view(), name='category-delete'),
    
    # Menu item endpoints
    path('restaurants/<slug:restaurant_slug>/menu-items/', views.MenuItemListView.as_view(), name='menu-item-list'),
    path('restaurants/<slug:restaurant_slug>/menu-items/create/', views.MenuItemCreateView.as_view(), name='menu-item-create'),
    path('restaurants/<slug:restaurant_slug>/menu-items/<int:pk>/', views.MenuItemDetailView.as_view(), name='menu-item-detail'),
    path('restaurants/<slug:restaurant_slug>/menu-items/<int:pk>/edit/', views.MenuItemUpdateView.as_view(), name='menu-item-update'),
    path('restaurants/<slug:restaurant_slug>/menu-items/<int:pk>/delete/', views.MenuItemDeleteView.as_view(), name='menu-item-delete'),
    path('restaurants/<slug:restaurant_slug>/menu-items/<int:pk>/upload-image/', views.MenuItemImageUploadView.as_view(), name='menu-item-upload-image'),
]

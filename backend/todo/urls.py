from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, CategoryViewSet, TaskViewSet

router = DefaultRouter()

router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('v1/auth/register/', RegisterView.as_view(), name='auth_register'),
    
    path('v1/', include(router.urls)),
]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.register import RegisterView
from .views.category import CategoryViewSet
from .views.task import TaskViewSet

router = DefaultRouter()

router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('v1/auth/register/', RegisterView.as_view(), name='auth_register'),
    
    path('v1/', include(router.urls)),
]
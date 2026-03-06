from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.register import RegisterView
from .views.category import CategoryViewSet
from .views.task import TaskViewSet
from .views.user import UserViewSet

router = DefaultRouter()

router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('v1/auth/register/', RegisterView.as_view(), name='auth_register'),
    
    path('v1/', include(router.urls)),
]
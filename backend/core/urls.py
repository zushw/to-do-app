from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from todo.views.register import RegisterView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('v1/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('v1/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('v1/auth/register/', RegisterView.as_view(), name='auth_register'),
]

import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User

@pytest.mark.django_db
class TestAuthentication:
    
    def test_register_user_success(self, api_client):
        url = reverse('auth_register')
        data = {
            "username": "newuser", 
            "password": "Valid@Password123", 
            "email": "test@test.com"
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(username="newuser").exists()

    def test_login_returns_jwt_token(self, api_client, user1):
        url = reverse('token_obtain_pair')
        data = {"username": "user1", "password": "Strong@Password123"}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data

    def test_register_missing_fields(self, api_client):
        url = reverse('auth_register')
        data = {"username": "newuser"}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in response.data

    def test_register_password_too_short(self, api_client):
        url = reverse('auth_register')
        data = {"username": "user", "password": "S@1", "email": "a@a.com"}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "The password must be at least 8 characters long." in response.data['password'][0]

    def test_register_password_no_uppercase(self, api_client):
        url = reverse('auth_register')
        data = {"username": "user", "password": "weak@password123", "email": "a@a.com"}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "The password must contain at least one uppercase letter." in response.data['password'][0]

    def test_register_password_no_special_char(self, api_client):
        url = reverse('auth_register')
        data = {"username": "user", "password": "WeakPassword123", "email": "a@a.com"}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "The password must contain at least one special character." in response.data['password'][0]
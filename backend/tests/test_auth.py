import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User

@pytest.mark.django_db
class TestAuthentication:
    
    def test_register_user_success(self, api_client):
        url = reverse('auth_register')
        data = {"username": "newuser", "password": "Strong@Password123", "email": "test@test.com"}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(username="newuser").exists()

    def test_register_user_missing_password(self, api_client):
        url = reverse('auth_register')
        data = {"username": "newuser"}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        
    def test_register_user_missing_username(self, api_client):
        url = reverse('auth_register')
        data = {"password": "Strong@Password123"}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_login_returns_jwt_token(self, api_client, user1):
        url = reverse('token_obtain_pair')
        data = {"username": "username1", "password": "Strong@Password123"}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        
    def test_login_wrong_data(self, api_client, user1):
        url = reverse('token_obtain_pair')
        data = {"username": "username1", "password": "wrongpass"}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

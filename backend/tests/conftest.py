import pytest
from rest_framework.test import APIClient
from django.contrib.auth.models import User

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user1():
    return User.objects.create_user(username="username1", email="email@teste.com", password="Strong@Password123")

@pytest.fixture
def user2():
    return User.objects.create_user(username="username2", password="Strong@Password123")
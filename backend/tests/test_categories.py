import pytest
from django.urls import reverse
from rest_framework import status
from todo.models import Category

@pytest.mark.django_db
class TestCategoriesCRUD:

    def test_create_category(self, api_client, user1):
        api_client.force_authenticate(user=user1)
        url = reverse('category-list')
        response = api_client.post(url, {"name": "Work"})
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Category.objects.count() == 1
        assert Category.objects.first().owner == user1
        
    def test_create_category_missing_name(self, api_client, user1):
        api_client.force_authenticate(user=user1)
        url = reverse('category-list')
        response = api_client.post(url, {})
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_list_categories_isolation(self, api_client, user1, user2):
        Category.objects.create(name="Cat User 1", owner=user1)
        Category.objects.create(name="Cat User 2", owner=user2)
        
        api_client.force_authenticate(user=user1)
        url = reverse('category-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['name'] == "Cat User 1"
        
    def test_update_category(self, api_client, user1):
        api_client.force_authenticate(user=user1)
        category = Category.objects.create(name="Old Name", owner=user1)
        
        url = reverse('category-detail', args=[category.id])
        
        response = api_client.patch(url, {"name": "Updated Name"})
        
        assert response.status_code == status.HTTP_200_OK
        
        category.refresh_from_db()
        assert category.name == "Updated Name"

    def test_delete_category(self, api_client, user1):
        api_client.force_authenticate(user=user1)
        category = Category.objects.create(name="To delete", owner=user1)
        
        url = reverse('category-detail', args=[category.id])
        response = api_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Category.objects.count() == 0
import pytest
from django.urls import reverse
from rest_framework import status
from unittest.mock import patch
from todo.models import Task, Category

@pytest.mark.django_db
class TestTasksCRUD:

    def test_create_task(self, api_client, user1):
        api_client.force_authenticate(user=user1)
        url = reverse('task-list')
        response = api_client.post(url, {"title": "Buy bread", "description": "Go to bakery"})
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Task.objects.count() == 1
        
    def test_create_task_missing_title(self, api_client, user1):
        api_client.force_authenticate(user=user1)
        url = reverse('task-list')
        response = api_client.post(url, {"description": "Go to bakery"})
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        
    def test_create_task_missing_description(self, api_client, user1):
        api_client.force_authenticate(user=user1)
        url = reverse('task-list')
        response = api_client.post(url, {"title": "Buy bread"})
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Task.objects.count() == 1
        
    def test_update_task(self, api_client, user1):
        api_client.force_authenticate(user=user1)
        task = Task.objects.create(title="Old title", owner=user1)
        
        url = reverse('task-detail', args=[task.id])
        
        response = api_client.patch(url, {"title": "Updated title"})
        
        assert response.status_code == status.HTTP_200_OK
        
        task.refresh_from_db()
        assert task.title == "Updated title"

    def test_share_task_success(self, api_client, user1, user2):
        api_client.force_authenticate(user=user1)
        task = Task.objects.create(title="Secret Project", owner=user1)
        
        url = reverse('task-share', args=[task.id])
        response = api_client.post(url, {"username": "username2"})
        
        assert response.status_code == status.HTTP_200_OK
        task.refresh_from_db()
        assert user2 in task.shared_with.all()

    def test_list_shared_tasks(self, api_client, user1, user2):
        task = Task.objects.create(title="User 1 Task", owner=user1)
        task.shared_with.add(user2)
        
        api_client.force_authenticate(user=user2)
        url = reverse('task-list')
        response = api_client.get(url)
        
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['title'] == "User 1 Task"
        
    def test_unshare_task_success(self, api_client, user1, user2):
        api_client.force_authenticate(user=user1)
        task = Task.objects.create(title="Secret Project", owner=user1)
        
        url = reverse('task-unshare', args=[task.id])
        response = api_client.post(url, {"username": "username2"})
        
        assert response.status_code == status.HTTP_200_OK
        task.refresh_from_db()
        assert user2 not in task.shared_with.all()

    @patch('todo.views.task.requests.get')
    def test_change_task_status_external_api(self, mock_get, api_client, user1):
        api_client.force_authenticate(user=user1)
        task = Task.objects.create(title="Study Pytest", owner=user1)
        
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = [{"q": "You got it!", "a": "Autor Mock"}]
        
        url = reverse('task-change-status', args=[task.id])
        response = api_client.put(url, {"is_completed": True}, format='json')
        
        task.refresh_from_db()
        assert response.status_code == status.HTTP_200_OK
        assert task.is_completed is True
        assert task.external_quote == "You got it! - Autor Mock"
        mock_get.assert_called_once()
        
    def test_delete_task(self, api_client, user1):
        api_client.force_authenticate(user=user1)
        task = Task.objects.create(title="To delete", owner=user1)
        
        url = reverse('task-detail', args=[task.id])
        response = api_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Task.objects.count() == 0
        
    def test_task_pagination(self, api_client, user1):
        api_client.force_authenticate(user=user1)
        
        tasks = [Task(title=f"Task {i}", owner=user1) for i in range(15)]
        Task.objects.bulk_create(tasks)
        
        url = reverse('task-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 15
        assert len(response.data['results']) == 10
        assert response.data['next'] is not None 

    def test_task_filtering(self, api_client, user1):
        api_client.force_authenticate(user=user1)
        
        cat_work = Category.objects.create(name="Work", owner=user1)
        cat_home = Category.objects.create(name="Home", owner=user1)
        
        Task.objects.create(title="Report", owner=user1, category=cat_work, is_completed=True)
        Task.objects.create(title="Meeting", owner=user1, category=cat_work, is_completed=False)
        Task.objects.create(title="Wash dishes", owner=user1, category=cat_home, is_completed=True)
        
        url = reverse('task-list')
        
        response_cat = api_client.get(f"{url}?category={cat_work.id}")
        assert response_cat.status_code == status.HTTP_200_OK
        assert len(response_cat.data['results']) == 2
        
        response_status = api_client.get(f"{url}?is_completed=true") 
        assert len(response_status.data['results']) == 2
        
        response_combinado = api_client.get(f"{url}?category={cat_work.id}&is_completed=true")
        assert len(response_combinado.data['results']) == 1
        assert response_combinado.data['results'][0]['title'] == "Report"
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.contrib.auth.models import User
import requests

from ..models import Task
from ..serializers.task import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'is_completed']

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(Q(owner=user) | Q(shared_with=user)).distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        serializer.save()
            
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        task = self.get_object()

        if task.owner != request.user:
            return Response(
                {"detail": "Only the owner can share the task."},
                status=status.HTTP_403_FORBIDDEN
            )

        username = request.data.get('username')
        if not username:
            return Response(
                {"detail": "Please, fill the 'username' field."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user_to_share = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if user_to_share == request.user:
            return Response(
                {"detail": "You can't share a task with yourself."},
                status=status.HTTP_400_BAD_REQUEST
            )

        task.shared_with.add(user_to_share)
        
        return Response(
            {"detail": f"Task shared successfully with {user_to_share.username}!"},
            status=status.HTTP_200_OK
        )
        
    @action(detail=True, methods=['put'])
    def change_status(self, request, pk=None):
        task = self.get_object()
        
        if task.owner != request.user:
            return Response(
                {"detail": "Only the owner can change the task status."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        if 'is_completed' not in request.data:
            return Response(
                {"detail": "Please fill the 'is_completed' field"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        task.is_completed = request.data.get('is_completed')
        
        if task.is_completed and not task.external_quote:
            try:
                response = requests.get("https://zenquotes.io/api/random", timeout=5)
                if response.status_code == 200:
                    data = response.json()
                    task.external_quote = f"{data[0]['q']} - {data[0]['a']}"
                    task.save()
            except requests.RequestException:
                pass
            
        task.save()
        
        return Response(
            {
                "detail": "Task is_completed status changed successfully!",
                "is_completed": task.is_completed,
                "quote": task.external_quote
            },
            status=status.HTTP_200_OK
        )
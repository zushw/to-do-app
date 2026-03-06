from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
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
        instance = serializer.save()
        
        if instance.is_completed and not instance.external_quote:
            try:
                response = requests.get("https://zenquotes.io/api/random", timeout=5)
                if response.status_code == 200:
                    data = response.json()
                    instance.external_quote = f"{data[0]['q']} - {data[0]['a']}"
                    instance.save()
            except requests.RequestException:
                pass
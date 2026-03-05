from rest_framework import serializers
from ..models import Task 

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'is_completed', 'created_at', 
            'category', 'owner', 'shared_with'
        ]
        read_only_fields = ['owner', 'created_at']
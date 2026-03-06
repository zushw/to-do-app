from rest_framework import serializers
from ..models import Task 

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'is_completed', 'created_at', 
            'category', 'owner', 'shared_with', 'external_quote'
        ]
        read_only_fields = ['owner', 'external_quote', 'created_at',]
from rest_framework import serializers
from ..models import Task 

class TaskSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    shared_with_usernames = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field='username', source='shared_with'
    )
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'is_completed', 'created_at', 
            'category', 'owner', 'shared_with', 'external_quote', 'owner_username', 'shared_with_usernames'
        ]
        read_only_fields = ['owner', 'external_quote', 'created_at',]
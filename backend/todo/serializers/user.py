import re
from rest_framework import serializers
from django.contrib.auth.models import User


def validate_strong_password(password):
    if len(password) < 8:
        raise serializers.ValidationError("The password must be at least 8 characters long.")
    if not re.search(r'[A-Z]', password):
        raise serializers.ValidationError("The password must contain at least one uppercase letter.")
    if not re.search(r'[a-z]', password):
        raise serializers.ValidationError("The password must contain at least one lowercase letter.")
    if not re.search(r'\d', password):
        raise serializers.ValidationError("The password must contain at least one number.")
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        raise serializers.ValidationError("The password must contain at least one special character.")
    return password

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
        
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_username(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("The username must be at least 6 characters long.")
        return value
    
    def validate_password(self, value):
        return validate_strong_password(value)
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user
    
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
        read_only_fields = ['id']

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    
    def validate_new_password(self, value):
        return validate_strong_password(value)
    
    
class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']
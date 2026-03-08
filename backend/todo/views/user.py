from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from ..serializers.user import UserPublicSerializer, UserUpdateSerializer, ChangePasswordSerializer
from drf_spectacular.utils import extend_schema

class UserViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = User.objects.all()
    serializer_class = UserPublicSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.all().order_by('username')
    
    @extend_schema(request=UserUpdateSerializer, responses=UserPublicSerializer)
    @action(detail=False, methods=['get', 'patch', 'put', 'delete'])
    def me(self, request):
        user = request.user 

        if request.method == 'GET':
            serializer = UserUpdateSerializer(user)
            return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = UserUpdateSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        elif request.method in ['DELETE']:
            user.delete() 
            return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['post'], url_path='change-password')
    def change_password(self, request):
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            if not user.check_password(serializer.validated_data.get('current_password')):
                return Response(
                    {"current_password": ["Wrong password."]}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.set_password(serializer.validated_data.get('new_password'))
            user.save()
            
            return Response({"detail": "Password updated successfully!"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
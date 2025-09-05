from django.shortcuts import render
from django.contrib.auth import logout
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from .models import CustomUser
from .serializers import (
    BorrowerRegistrationSerializer, 
    LendingCompanyRegistrationSerializer,
    LoginSerializer,
    UserProfileSerializer
)

class AuthViewSet(viewsets.ViewSet):
    """
    ViewSet for authentication operations
    """
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['post'])
    def register_borrower(self, request):
        """
        Register a new borrower
        """
        serializer = BorrowerRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            return Response({
                'message': 'Borrower registered successfully',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'user_type': user.user_type,
                    'role': user.role,
                    'full_name': user.get_full_name()
                },
                'tokens': {
                    'access': str(access_token),
                    'refresh': str(refresh)
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def register_company(self, request):
        """
        Register a new lending company
        """
        serializer = LendingCompanyRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            return Response({
                'message': 'Lending company registered successfully',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'user_type': user.user_type,
                    'role': user.role,
                    'company_name': user.company_name,
                    'full_name': user.get_full_name()
                },
                'tokens': {
                    'access': str(access_token),
                    'refresh': str(refresh)
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        """
        Login for both borrowers and lending companies
        """
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            return Response({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'user_type': user.user_type,
                    'role': user.role,
                    'full_name': user.get_full_name(),
                    'company_name': user.company_name if user.user_type == 'lending_company' else None
                },
                'tokens': {
                    'access': str(access_token),
                    'refresh': str(refresh)
                }
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def logout(self, request):
        """
        Logout user by blacklisting refresh token
        """
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return Response({
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': 'Invalid token'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def profile(self, request):
        """
        Get current user profile
        """
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def refresh_token(self, request):
        """
        Refresh access token using refresh token
        """
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response({
                    'error': 'Refresh token required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            refresh = RefreshToken(refresh_token)
            access_token = refresh.access_token
            
            return Response({
                'access': str(access_token)
            }, status=status.HTTP_200_OK)
            
        except TokenError as e:
            return Response({
                'error': 'Invalid refresh token'
            }, status=status.HTTP_401_UNAUTHORIZED)

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for user management (admin only)
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        """
        Set custom permissions for each action.
        """
        if self.action in ['list', 'retrieve', 'update', 'partial_update', 'destroy']:
            # Only admin users can perform these actions
            self.permission_classes = [permissions.IsAuthenticated]
        return super().get_permissions()
    
    def get_queryset(self):
        """
        Filter queryset based on user role
        """
        user = self.request.user
        if user.role == 'admin':
            return CustomUser.objects.all()
        else:
            # Regular users can only see their own profile
            return CustomUser.objects.filter(id=user.id)
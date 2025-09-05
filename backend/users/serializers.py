from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser

class BorrowerRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for borrower registration
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = (
            'email', 'username', 'password', 'password_confirm',
            'first_name', 'last_name', 'date_of_birth', 
            'phone_number', 'address'
        )
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        validated_data['user_type'] = 'borrower'
        validated_data['role'] = 'borrower'
        
        user = CustomUser.objects.create_user(**validated_data)
        return user

class LendingCompanyRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for lending company registration
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = (
            'email', 'username', 'password', 'password_confirm',
            'company_name', 'company_registration_number',
            'company_address', 'company_phone', 'first_name', 'last_name'
        )
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        validated_data['user_type'] = 'lending_company'
        validated_data['role'] = 'admin'  # Default role for company users
        
        user = CustomUser.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login (both borrowers and lending companies)
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid email or password.')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
            
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include email and password.')

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile (read-only for sensitive info)
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    
    class Meta:
        model = CustomUser
        fields = (
            'id', 'email', 'username', 'user_type', 'role', 
            'first_name', 'last_name', 'full_name',
            'company_name', 'company_registration_number',
            'date_of_birth', 'phone_number', 'address',
            'company_address', 'company_phone', 'is_verified',
            'created_at'
        )
        read_only_fields = ('id', 'email', 'user_type', 'created_at')
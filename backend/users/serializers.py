from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, Company, Client

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
        
        # Create Client profile
        Client.objects.create(user=user)
        
        return user

class LendingCompanyRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for lending company registration
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    company_name = serializers.CharField(max_length=255)
    company_registration_number = serializers.CharField(max_length=100)
    company_address = serializers.CharField()
    company_phone = serializers.CharField(max_length=20, required=False)
    
    class Meta:
        model = CustomUser
        fields = (
            'email', 'username', 'password', 'password_confirm',
            'first_name', 'last_name', 'company_name', 
            'company_registration_number', 'company_address', 'company_phone'
        )
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs
    
    def validate_company_registration_number(self, value):
        if Company.objects.filter(company_registration_number=value).exists():
            raise serializers.ValidationError("This registration number already exists.")
        return value
    
    def create(self, validated_data):
        # Extract company data
        company_data = {
            'company_name': validated_data.pop('company_name'),
            'company_registration_number': validated_data.pop('company_registration_number'),
            'company_address': validated_data.pop('company_address'),
            'company_phone': validated_data.pop('company_phone', ''),
        }
        
        validated_data.pop('password_confirm')
        validated_data['user_type'] = 'lending_company'
        validated_data['role'] = 'admin'  # Default role for company users
        
        user = CustomUser.objects.create_user(**validated_data)
        
        # Create Company profile
        Company.objects.create(user=user, **company_data)
        
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
    company_profile = serializers.SerializerMethodField()
    client_profile = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = (
            'id', 'email', 'username', 'user_type', 'role', 
            'first_name', 'last_name', 'full_name',
            'date_of_birth', 'phone_number', 'address',
            'is_verified', 'created_at', 'company_profile', 'client_profile'
        )
        read_only_fields = ('id', 'email', 'user_type', 'created_at')
    
    def get_company_profile(self, obj):
        if obj.user_type == 'lending_company' and hasattr(obj, 'company_profile'):
            return CompanySerializer(obj.company_profile).data
        return None
    
    def get_client_profile(self, obj):
        if obj.user_type == 'borrower' and hasattr(obj, 'client_profile'):
            return ClientSerializer(obj.client_profile).data
        return None

class CompanySerializer(serializers.ModelSerializer):
    """
    Serializer for Company model
    """
    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

class ClientSerializer(serializers.ModelSerializer):
    """
    Serializer for Client model
    """
    class Meta:
        model = Client
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')
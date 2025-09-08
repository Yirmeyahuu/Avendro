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
    Enhanced serializer for lending company registration with Philippine requirements
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    # Company Information
    company_name = serializers.CharField(max_length=255)
    
    # Address Information
    business_street = serializers.CharField(max_length=255)
    business_barangay = serializers.CharField(max_length=100)
    business_city = serializers.CharField(max_length=100)
    business_region = serializers.ChoiceField(choices=Company.REGION_CHOICES)
    
    # Contact Information
    contact_person_name = serializers.CharField(max_length=200)
    contact_person_email = serializers.EmailField()
    contact_person_phone = serializers.CharField(max_length=20)
    company_phone = serializers.CharField(max_length=20)
    
    # Legal Registration
    sec_registration_number = serializers.CharField(max_length=100)
    company_tin = serializers.CharField(max_length=20)
    
    # Business Details
    business_type = serializers.CharField(max_length=100)
    license_number = serializers.CharField(max_length=100)
    
    # Business Operations
    loan_products_offered = serializers.ListField(
        child=serializers.ChoiceField(choices=Company.LOAN_PRODUCT_CHOICES),
        allow_empty=False
    )
    minimum_interest_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    maximum_interest_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    processing_fee = serializers.DecimalField(max_digits=5, decimal_places=2)  # Removed required=False
    late_payment_fee = serializers.DecimalField(max_digits=5, decimal_places=2)  # Removed required=False
    
    # Lending Policies
    lending_policy_description = serializers.CharField()
    minimum_loan_amount = serializers.DecimalField(max_digits=12, decimal_places=2)  # Removed required=False
    maximum_loan_amount = serializers.DecimalField(max_digits=12, decimal_places=2)  # Removed required=False
    loan_term_minimum_months = serializers.IntegerField()  # Removed required=False
    loan_term_maximum_months = serializers.IntegerField()  # Removed required=False
    
    # Bank Account Information
    bank_name = serializers.CharField(max_length=100)
    bank_account_number = serializers.CharField(max_length=50)
    bank_account_name = serializers.CharField(max_length=200)
    bank_branch = serializers.CharField(max_length=100)  # Removed required=False
    
    class Meta:
        model = CustomUser
        fields = (
            'email', 'username', 'password', 'password_confirm',
            'first_name', 'last_name', 
            # Company fields
            'company_name', 'business_street', 'business_barangay', 
            'business_city', 'business_region', 'contact_person_name',
            'contact_person_email', 'contact_person_phone', 'company_phone',
            'sec_registration_number', 'company_tin', 'business_type', 'license_number',
            'loan_products_offered', 'minimum_interest_rate', 'maximum_interest_rate', 
            'processing_fee', 'late_payment_fee', 'lending_policy_description', 
            'minimum_loan_amount', 'maximum_loan_amount', 'loan_term_minimum_months', 
            'loan_term_maximum_months', 'bank_name', 'bank_account_number', 
            'bank_account_name', 'bank_branch'
        )
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        
        # Validate interest rates
        if attrs['minimum_interest_rate'] >= attrs['maximum_interest_rate']:
            raise serializers.ValidationError("Minimum interest rate must be less than maximum interest rate.")
        
        # Validate loan amounts if provided
        min_amount = attrs.get('minimum_loan_amount')
        max_amount = attrs.get('maximum_loan_amount')
        if min_amount and max_amount and min_amount >= max_amount:
            raise serializers.ValidationError("Minimum loan amount must be less than maximum loan amount.")
        
        # Validate loan terms if provided
        min_term = attrs.get('loan_term_minimum_months')
        max_term = attrs.get('loan_term_maximum_months')
        if min_term and max_term and min_term >= max_term:
            raise serializers.ValidationError("Minimum loan term must be less than maximum loan term.")
        
        return attrs
    
    def validate_sec_registration_number(self, value):
        if Company.objects.filter(sec_registration_number=value).exists():
            raise serializers.ValidationError("This SEC registration number already exists.")
        return value
    
    def validate_company_tin(self, value):
        if Company.objects.filter(company_tin=value).exists():
            raise serializers.ValidationError("This TIN already exists.")
        return value
    
    def create(self, validated_data):
        # Extract company data
        company_fields = [
            'company_name', 'business_street', 'business_barangay', 
            'business_city', 'business_region', 'contact_person_name',
            'contact_person_email', 'contact_person_phone', 'company_phone',
            'sec_registration_number', 'company_tin', 'business_type', 'license_number',
            'loan_products_offered', 'minimum_interest_rate', 'maximum_interest_rate', 
            'processing_fee', 'late_payment_fee', 'lending_policy_description', 
            'minimum_loan_amount', 'maximum_loan_amount', 'loan_term_minimum_months', 
            'loan_term_maximum_months', 'bank_name', 'bank_account_number', 
            'bank_account_name', 'bank_branch'
        ]
        
        company_data = {}
        for field in company_fields:
            if field in validated_data:
                company_data[field] = validated_data.pop(field)
        
        validated_data.pop('password_confirm')
        validated_data['user_type'] = 'lending_company'
        validated_data['role'] = 'admin'
        
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
    full_address = serializers.CharField(source='get_full_address', read_only=True)
    loan_products_display = serializers.CharField(source='get_loan_products_display', read_only=True)
    
    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'full_address', 'loan_products_display')

class ClientSerializer(serializers.ModelSerializer):
    """
    Serializer for Client model
    """
    class Meta:
        model = Client
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')
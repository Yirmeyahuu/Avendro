from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, Company, Client



# At the top of the file, add:
REGION_CHOICES = [
    ('ncr', 'National Capital Region (NCR)'),
    ('car', 'Cordillera Administrative Region (CAR)'),
    ('region1', 'Ilocos Region (Region I)'),
    ('region2', 'Cagayan Valley (Region II)'),
    ('region3', 'Central Luzon (Region III)'),
    ('region4a', 'CALABARZON (Region IV-A)'),
    ('region4b', 'MIMAROPA (Region IV-B)'),
    ('region5', 'Bicol Region (Region V)'),
    ('region6', 'Western Visayas (Region VI)'),
    ('region7', 'Central Visayas (Region VII)'),
    ('region8', 'Eastern Visayas (Region VIII)'),
    ('region9', 'Zamboanga Peninsula (Region IX)'),
    ('region10', 'Northern Mindanao (Region X)'),
    ('region11', 'Davao Region (Region XI)'),
    ('region12', 'SOCCSKSARGEN (Region XII)'),
    ('region13', 'Caraga (Region XIII)'),
    ('barmm', 'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)'),
]


class BorrowerRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for comprehensive borrower registration
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    # Client profile fields
    middle_name = serializers.CharField(max_length=100, required=False, allow_blank=True)
    gender = serializers.ChoiceField(choices=[
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    ])
    marital_status = serializers.ChoiceField(
        choices=[
            ('single', 'Single'),
            ('married', 'Married'),
            ('divorced', 'Divorced'),
            ('widowed', 'Widowed'),
            ('separated', 'Separated')
        ],
        required=False,
        allow_blank=True
    )
    
    # Current Address
    current_street = serializers.CharField(max_length=255)
    current_barangay = serializers.CharField(max_length=100)
    current_city = serializers.CharField(max_length=100)
    current_region = serializers.ChoiceField(choices=REGION_CHOICES)

    
    # Permanent Address
    permanent_street = serializers.CharField(max_length=255)
    permanent_barangay = serializers.CharField(max_length=100)
    permanent_city = serializers.CharField(max_length=100)
    permanent_region = serializers.ChoiceField(choices=REGION_CHOICES)
    
    # Employment Information
    employment_status = serializers.ChoiceField(choices=[
        ('employed', 'Employed'),
        ('self_employed', 'Self-Employed'),
        ('unemployed', 'Unemployed'),
        ('retired', 'Retired'),
        ('student', 'Student')
    ])
    company_name = serializers.CharField(max_length=200, required=False, allow_blank=True)
    job_title = serializers.CharField(max_length=150, required=False, allow_blank=True)
    monthly_income = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, allow_null=True)
    source_of_income = serializers.CharField(required=False, allow_blank=True)
    
    # Bank Information
    bank_name = serializers.CharField(max_length=100)
    bank_account_number = serializers.CharField(max_length=50)
    bank_account_name = serializers.CharField(max_length=200)
    
    class Meta:
        model = CustomUser
        fields = (
            # User fields
            'email', 'username', 'password', 'password_confirm',
            'first_name', 'last_name', 'date_of_birth', 'phone_number',
            
            # Client profile fields
            'middle_name', 'gender', 'marital_status',
            
            # Current Address
            'current_street', 'current_barangay', 'current_city', 'current_region',
            
            # Permanent Address
            'permanent_street', 'permanent_barangay', 'permanent_city', 'permanent_region',
            
            # Employment
            'employment_status', 'company_name', 'job_title', 'monthly_income', 'source_of_income',
            
            # Bank Information
            'bank_name', 'bank_account_number', 'bank_account_name'
        )
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        
        # Validate employment fields based on status
        employment_status = attrs.get('employment_status')
        if employment_status in ['employed', 'self_employed']:
            if not attrs.get('company_name'):
                raise serializers.ValidationError({
                    'company_name': 'Company name is required for employed/self-employed status.'
                })
            if not attrs.get('job_title'):
                raise serializers.ValidationError({
                    'job_title': 'Job title is required for employed/self-employed status.'
                })
            if not attrs.get('monthly_income'):
                raise serializers.ValidationError({
                    'monthly_income': 'Monthly income is required for employed/self-employed status.'
                })
        
        # Validate income source for unemployed/student/retired
        if employment_status in ['unemployed', 'student', 'retired']:
            if not attrs.get('source_of_income'):
                raise serializers.ValidationError({
                    'source_of_income': 'Source of income description is required.'
                })
        
        return attrs
    
    def create(self, validated_data):
        # Separate user fields from client profile fields
        client_fields = [
            'middle_name', 'gender', 'marital_status',
            'current_street', 'current_barangay', 'current_city', 'current_region',
            'permanent_street', 'permanent_barangay', 'permanent_city', 'permanent_region',
            'employment_status', 'company_name', 'job_title', 'monthly_income', 'source_of_income',
            'bank_name', 'bank_account_number', 'bank_account_name'
        ]
        
        # Extract client data
        client_data = {}
        for field in client_fields:
            if field in validated_data:
                client_data[field] = validated_data.pop(field)
        
        # Handle empty strings and None values for optional fields
        if not client_data.get('marital_status'):
            client_data['marital_status'] = None
        if not client_data.get('company_name'):
            client_data['company_name'] = None
        if not client_data.get('job_title'):
            client_data['job_title'] = None
        if not client_data.get('monthly_income'):
            client_data['monthly_income'] = None
        if not client_data.get('source_of_income'):
            client_data['source_of_income'] = None
        
        # Remove password confirmation and set user type
        validated_data.pop('password_confirm')
        validated_data['user_type'] = 'borrower'
        validated_data['role'] = 'borrower'
        
        # Create user
        user = CustomUser.objects.create_user(**validated_data)
        
        # Create Client profile with the extracted data
        Client.objects.create(user=user, **client_data)
        
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
    Serializer for Client model with full user information
    """
    # Include user fields
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    date_of_birth = serializers.DateField(source='user.date_of_birth', read_only=True)
    phone_number = serializers.CharField(source='user.phone_number', read_only=True)
    
    # Computed fields
    full_name = serializers.SerializerMethodField()
    full_current_address = serializers.ReadOnlyField()
    full_permanent_address = serializers.ReadOnlyField()
    
    # Choice field display names
    gender_display = serializers.CharField(source='get_gender_display', read_only=True)
    marital_status_display = serializers.CharField(source='get_marital_status_display', read_only=True)
    employment_status_display = serializers.CharField(source='get_employment_status_display', read_only=True)
    current_region_display = serializers.CharField(source='get_current_region_display', read_only=True)
    permanent_region_display = serializers.CharField(source='get_permanent_region_display', read_only=True)
    
    class Meta:
        model = Client
        fields = [
            'id',
            # User information
            'email', 'first_name', 'last_name', 'full_name', 'date_of_birth', 'phone_number',
            
            # Personal information
            'middle_name', 'gender', 'gender_display', 'marital_status', 'marital_status_display',
            
            # Current Address
            'current_street', 'current_barangay', 'current_city', 'current_region', 'current_region_display', 'full_current_address',
            
            # Permanent Address
            'permanent_street', 'permanent_barangay', 'permanent_city', 'permanent_region', 'permanent_region_display', 'full_permanent_address',
            
            # Employment
            'employment_status', 'employment_status_display', 'company_name', 'job_title', 
            'monthly_income', 'source_of_income',
            
            # Bank Information
            'bank_name', 'bank_account_number', 'bank_account_name',
            
            # Timestamps
            'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def get_full_name(self, obj):
        if obj.middle_name:
            return f"{obj.user.first_name} {obj.middle_name} {obj.user.last_name}".strip()
        return obj.user.get_full_name()
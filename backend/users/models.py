from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    """
    Custom user model for the Lending Management System
    """
    USER_TYPE_CHOICES = [
        ('borrower', 'Borrower'),
        ('lending_company', 'Lending Company'),
    ]
    
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('employee', 'Employee'),
        ('borrower', 'Borrower'),
    ]
    
    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='borrower')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='borrower')
    
    # Personal information for all users
    date_of_birth = models.DateField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    
    # Common fields
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})" if self.first_name else self.email
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username

class Company(models.Model):
    """
    Enhanced model for lending companies with Philippine business requirements
    """
    # Loan Product Choices
    LOAN_PRODUCT_CHOICES = [
        ('personal', 'Personal Loans'),
        ('business', 'Business Loans'),
        ('salary', 'Salary Loans'),
        ('vehicle', 'Vehicle Loans'),
        ('housing', 'Housing Loans'),
        ('payday', 'Payday Loans'),
        ('collateral', 'Collateral Loans'),
        ('sme', 'SME Loans'),
    ]
    
    # Philippine Regions
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
    
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='company_profile')
    
    # Basic Company Information
    company_name = models.CharField(max_length=255, unique=True, default="")
    
    # Address Information (Separated as requested)
    business_street = models.CharField(max_length=255, default='')
    business_barangay = models.CharField(max_length=100, default='')
    business_city = models.CharField(max_length=100, default='')
    business_region = models.CharField(max_length=20, choices=REGION_CHOICES, default='ncr')
    
    # Contact Information
    contact_person_name = models.CharField(max_length=200, default="")
    contact_person_email = models.EmailField(default="")
    contact_person_phone = models.CharField(max_length=20, default="")
    company_phone = models.CharField(max_length=20, default="")
    
    # Legal Registration Information
    sec_registration_number = models.CharField(max_length=100, unique=True, help_text="SEC Registration Number", default="")
    company_tin = models.CharField(max_length=20, unique=True, help_text="Tax Identification Number", default="")
    
    # Business Operations
    loan_products_offered = models.JSONField(default=list, help_text="List of loan products offered")
    minimum_interest_rate = models.DecimalField(max_digits=5, decimal_places=2, help_text="Minimum interest rate (%)", blank=True, null=True)
    maximum_interest_rate = models.DecimalField(max_digits=5, decimal_places=2, help_text="Maximum interest rate (%)", blank=True, null=True)
    processing_fee = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, help_text="Processing fee (%)")
    late_payment_fee = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, help_text="Late payment fee (%)")
    
    # Lending Policies
    lending_policy_description = models.TextField(help_text="Brief description of loan approval process and criteria", blank=True, null=True)
    minimum_loan_amount = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    maximum_loan_amount = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    loan_term_minimum_months = models.IntegerField(blank=True, null=True)
    loan_term_maximum_months = models.IntegerField(blank=True, null=True)
    
    # Bank Account Information
    bank_name = models.CharField(max_length=100, default="")
    bank_account_number = models.CharField(max_length=50, default="")
    bank_account_name = models.CharField(max_length=200, default="")
    bank_branch = models.CharField(max_length=100, blank=True, null=True)
    
    # Business Details
    business_type = models.CharField(max_length=100, default="")
    license_number = models.CharField(max_length=100, default="")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'Company'
        verbose_name = 'Company'
        verbose_name_plural = 'Companies'
    
    def __str__(self):
        return f"{self.company_name} ({self.sec_registration_number})"
    
    def get_full_address(self):
        return f"{self.business_street}, {self.business_barangay}, {self.business_city}, {self.get_business_region_display()}"
    
    def get_loan_products_display(self):
        """Get display names for loan products"""
        product_dict = dict(self.LOAN_PRODUCT_CHOICES)
        return [product_dict.get(product, product) for product in self.loan_products_offered]

class Client(models.Model):
    """
    Model for borrowers/clients with comprehensive personal and financial information
    """
    # Philippine Regions (same as Company model)
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
    
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='client_profile')
    
    # Personal Information
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    gender = models.CharField(max_length=10, default='' , choices=[
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    ])
    marital_status = models.CharField(max_length=20, blank=True, null=True, choices=[
        ('single', 'Single'),
        ('married', 'Married'),
        ('divorced', 'Divorced'),
        ('widowed', 'Widowed'),
        ('separated', 'Separated')
    ])
    
    # Current Address
    current_street = models.CharField(max_length=255, help_text="Building No., Street Name", default="")
    current_barangay = models.CharField(max_length=100, default="")
    current_city = models.CharField(max_length=100, default="")
    current_region = models.CharField(max_length=20, choices=REGION_CHOICES, default='ncr')
    
    # Permanent Address
    permanent_street = models.CharField(max_length=255, help_text="Building No., Street Name", default="")
    permanent_barangay = models.CharField(max_length=100, default="")
    permanent_city = models.CharField(max_length=100, default="")
    permanent_region = models.CharField(max_length=20, choices=REGION_CHOICES, default='ncr')
    
    # Employment Information
    employment_status = models.CharField(max_length=20, default='' , choices=[
        ('employed', 'Employed'),
        ('self_employed', 'Self-Employed'),
        ('unemployed', 'Unemployed'),
        ('retired', 'Retired'),
        ('student', 'Student')
    ])
    company_name = models.CharField(max_length=200, blank=True, null=True)
    job_title = models.CharField(max_length=150, blank=True, null=True)
    monthly_income = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    source_of_income = models.TextField(help_text="Brief description of income source", blank=True, null=True)
    
    # Bank Information
    bank_name = models.CharField(max_length=100, default="")
    bank_account_number = models.CharField(max_length=50, default="")
    bank_account_name = models.CharField(max_length=200, help_text="Account holder name", default="")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'Client'
        verbose_name = 'Client'
        verbose_name_plural = 'Clients'
    
    def __str__(self):
        return f"{self.user.get_full_name()} ({self.user.email})"
    
    @property
    def full_current_address(self):
        return f"{self.current_street}, {self.current_barangay}, {self.current_city}, {self.get_current_region_display()}"
    
    @property
    def full_permanent_address(self):
        return f"{self.permanent_street}, {self.permanent_barangay}, {self.permanent_city}, {self.get_permanent_region_display()}"
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
    Separate model for lending companies
    """
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='company_profile')
    company_name = models.CharField(max_length=255)
    company_registration_number = models.CharField(max_length=100, unique=True)
    company_address = models.TextField()
    company_phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Business details
    business_type = models.CharField(max_length=100, blank=True, null=True)
    license_number = models.CharField(max_length=100, blank=True, null=True)
    
    # Status and verification
    is_verified = models.BooleanField(default=False)
    verification_date = models.DateTimeField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'Company'
        verbose_name = 'Company'
        verbose_name_plural = 'Companies'
    
    def __str__(self):
        return f"{self.company_name} ({self.company_registration_number})"

class Client(models.Model):
    """
    Separate model for borrowers/clients
    """
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='client_profile')
    
    # Personal information
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    gender = models.CharField(max_length=10, choices=[
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    ], blank=True, null=True)
    
    # Contact information
    emergency_contact_name = models.CharField(max_length=200, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True, null=True)
    emergency_contact_relationship = models.CharField(max_length=100, blank=True, null=True)
    
    # Employment information
    employment_status = models.CharField(max_length=100, blank=True, null=True)
    employer_name = models.CharField(max_length=200, blank=True, null=True)
    monthly_income = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    
    # Financial information
    credit_score = models.IntegerField(blank=True, null=True)
    
    # Status and verification
    is_verified = models.BooleanField(default=False)
    verification_date = models.DateTimeField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'Client'
        verbose_name = 'Client'
        verbose_name_plural = 'Clients'
    
    def __str__(self):
        return f"{self.user.get_full_name()} ({self.user.email})"
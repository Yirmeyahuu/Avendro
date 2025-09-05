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
    
    # Additional fields for lending companies
    company_name = models.CharField(max_length=255, blank=True, null=True)
    company_registration_number = models.CharField(max_length=100, blank=True, null=True)
    company_address = models.TextField(blank=True, null=True)
    company_phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Additional fields for borrowers
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
        if self.user_type == 'lending_company' and self.company_name:
            return f"{self.company_name} ({self.email})"
        return f"{self.first_name} {self.last_name} ({self.email})" if self.first_name else self.email
    
    def get_full_name(self):
        if self.user_type == 'lending_company':
            return self.company_name or self.email
        return f"{self.first_name} {self.last_name}".strip() or self.username
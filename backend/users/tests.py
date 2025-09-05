from django.test import TestCase
from .models import CustomUser
from .serializers import UserSerializer

class CustomUserTestCase(TestCase):
    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'password': 'testpass123',
            'role': 'borrower'
        }
    
    def test_user_creation(self):
        user = CustomUser.objects.create_user(**self.user_data)
        self.assertEqual(user.email, self.user_data['email'])
        self.assertEqual(user.role, self.user_data['role'])
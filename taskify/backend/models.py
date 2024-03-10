from datetime import datetime
import uuid
from django.db import models
from django.core.validators import MinLengthValidator
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission

# Create your models here.
class Task(models.Model):
    STATUS_CHOICES = [
        ('InProgress', 'In Progress'),
        ('Complete', 'Complete'),
        ('Deleted', 'Deleted')
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, default = "untitled")
    description = models.CharField(max_length=1023)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='InProgress')
    due_date = models.DateTimeField()
    created_at = models.DateTimeField(default=datetime.now)
    assigned_user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='tasks')

class Company(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True, default='example@example.com')
    password = models.CharField(max_length=255, default='password', validators=[MinLengthValidator(8)])
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=datetime.now)
    is_manager = models.BooleanField(default=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='users')

    objects = CustomUserManager()

    USERNAME_FIELD = 'username' 
    REQUIRED_FIELDS = ['first_name', 'last_name', 'password', 'company', 'email']

    groups = models.ManyToManyField(Group, related_name='custom_user_groups')
    user_permissions = models.ManyToManyField(Permission, related_name='custom_user_permissions')




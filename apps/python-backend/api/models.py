import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


class Role(models.TextChoices):
    TEACHER = "TEACHER", "Teacher"
    STUDENT = "STUDENT", "Student"
    GUEST = "GUEST", "Guest"


class ShapeType(models.TextChoices):
    RECTANGLE = "RECTANGLE", "Rectangle"
    CIRCLE = "CIRCLE", "Circle"
    LINE = "LINE", "Line"


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    photo = models.URLField(blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

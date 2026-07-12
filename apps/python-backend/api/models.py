import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class Role(models.TextChoices):
    TEACHER = "TEACHER"
    STUDENT = "STUDENT"
    GUEST = "GUEST"


class ShapeType(models.TextChoices):
    RECTANGLE = "RECTANGLE"
    CIRCLE = "CIRCLE"
    LINE = "LINE"
    FREEHAND = "FREEHAND"
    TEXT = "TEXT"
    IMAGE = "IMAGE"
    ARROW = "ARROW"


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    photo = models.URLField(blank=True, null=True)

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="api_user_set",
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="api_user_permissions_set",
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]


class Room(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.CharField(max_length=30, unique=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    admin = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="administered_rooms"
    )

    objects = models.Manager()

    expiresAt = models.DateTimeField(null=True, blank=True)
    # 🐛 FIX: Removed "bool" and used "default="
    isLocked = models.BooleanField(default=False)
    isPublic = models.BooleanField(default=False)
    thumbnail = models.URLField(null=True, blank=True)


class RoomMember(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="room_memberships"
    )
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="members")
    canDraw = models.BooleanField(default=True)
    joinedAt = models.DateTimeField(auto_now_add=True)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.STUDENT)

    objects = models.Manager()

    class Meta:
        unique_together = ("user", "room")


class Shape(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="shapes")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="shapes")
    type = models.CharField(max_length=20, choices=ShapeType.choices)
    x1 = models.FloatField()
    x2 = models.FloatField()
    y1 = models.FloatField()
    y2 = models.FloatField()

    objects = models.Manager()

    points = models.JSONField(null=True, blank=True)
    color = models.CharField(max_length=7, default="#000000")
    sequence = models.IntegerField()
    createdAt = models.DateTimeField(auto_now_add=True)
    deletedAt = models.DateTimeField(null=True, blank=True)

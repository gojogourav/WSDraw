from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Room, Shape


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ["id", "slug", "admin", "createdAt"]
        read_only_fields = ["id", "admin", "createdAt"]

    def validate_slug(self, value):
        import re

        if not re.match(r"^[a-zA-Z0-9_-]+$", value):
            raise serializers.ValidationError(
                "Slug can only contain letters, numbers, underscores, and hyphens"
            )
        if len(value) < 3:
            raise serializers.ValidationError("Slug must be atleast 3 characters young")
        return value


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["email", "password", "name", "photo"]

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            name=validated_data.get("name", ""),
            photo=validated_data.get("photo", ""),
        )
        return user


class ShapeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shape
        fields = ["id", "room", "type", "x1", "x2", "y1", "y2", "color", "sequence"]
        read_only_fiends = ["id", "user", "createdAt", "deletedAt"]

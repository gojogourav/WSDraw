from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    CreateRoomView,
    GetMeView,
    RegisterView,
    ShapeListCreateView,
)

urlpatterns = [
    path("auth/signup/", RegisterView.as_view(), name="signup"),
    path("auth/login/", TokenObtainPairView.as_view(), name="login"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/me/", GetMeView.as_view(), name="get_me"),
    path("room/", CreateRoomView.as_view(), name="create_room"),
    path("shapes/", ShapeListCreateView.as_view(), name="shape_list_create"),
]

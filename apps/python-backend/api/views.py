from rest_framework import generics, serializers, status, views
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import RoomMember, Shape
from .serializers import RegisterSerializer, RoomSerializer, ShapeSerializer

# Create your views here.


class CreateRoomView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RoomSerializer(data=request.data)

        if serializer.is_valid():
            room = serializer.save(admin=request.user)

            RoomMember.objects.create(user=request.user, room=room)

            return Response(
                {"message": "Room created Successfuly", "room": serializer.data}
            )


class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "User registered successfully",
                "ok": True,
                "user": {
                    "email": user.email,
                    "name": user.name,
                    "profilePic": user.photo,
                },
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class ShapeListCreateView(generics.ListCreateAPIView):
    serializer_class = ShapeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        room_id = self.request.query_params.get("roomId")

        if not room_id:
            return Shape.objects.none()

        if not RoomMember.objects.filter(
            user=self.request.user, room_id=room_id
        ).exists():
            raise PermissionDenied("You don't have permission to draw.")

        return Shape.objects.filter(room_id=room_id, deletedAt__isnull=True).order_by(
            "-sequence"
        )

    def perform_create(self, serializer):
        room = serializer.validated_data.get("room")

        member = RoomMember.objects.filter(user=self.request.user, room=room).first()

        if not member:
            raise PermissionDenied("You are not member of this room ")
        if not member.canDraw:
            raise PermissionDenied("You don't have permission to draw.")

        serializer.save(user=self.request.user)


class GetMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"authenticated": True}, status=status.HTTP_200_OK)

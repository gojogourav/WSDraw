from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework.utils import json


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self) -> None:
        user = self.scope.get("user")

        if user and getattr(user, "is_authentiacted", False):
            await self.accept()

            username = getattr(user, "username", "User")

            await self.send(
                text_data=json.dumps(
                    {"message": f"Welcome, {username}! You are authenticated"}
                )
            )
        else:
            await self.close()

    async def disconnect(self, code: int) -> None:
        pass

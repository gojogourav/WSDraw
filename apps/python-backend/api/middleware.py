import urllib.parse

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken

User = get_user_model()


@database_sync_to_async
def get_user_from_token(token_string):
    try:
        access_token = AccessToken(token_string)
        user = User.objects.get(id=access_token["user_id"])
        return user
    except Exception:
        return AnonymousUser()


class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        query_params = urllib.parse.parse_qs(query_string)

        token = query_params.get("token")

        if token:
            scope["user"] = await get_user_from_token(token[0])

        else:
            scope["user"] = AnonymousUser()

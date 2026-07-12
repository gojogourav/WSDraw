"""
ASGI config for core_system project.
"""

import os

# 1. CHANGE THIS: Import the ASGI application, not WSGI
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core_system.settings")

# 2. CHANGE THIS: Initialize the ASGI app
django_asgi_app = get_asgi_application()

# 3. Import your Channels tools and custom code
from api import routing
from api.middleware import JWTAauthMiddleware
from channels.routing import ProtocolTypeRouter, URLRouter

application = ProtocolTypeRouter(
    {
        # 4. Pass the ASGI app to handle standard HTTP requests
        "http": django_asgi_app,
        "websocket": JWTAauthMiddleware(
            URLRouter(routing.websocket_urlpatterns),
        ),
    }
)

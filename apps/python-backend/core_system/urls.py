from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),  # The built-in admin panel
    path("api/", include("api.urls")),
]

"""
app URL Configuration
"""
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)
from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='api-schema'),
    path(
        'api/developer/',
        SpectacularSwaggerView.as_view(url_name='api-schema'),
        name='api-developer',
    ),
    path('api/user/', include('user.urls')),
    path('api/recipe/', include('recipe.urls')),
]

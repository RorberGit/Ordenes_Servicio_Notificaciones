# myproject/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from apps.administrar.views import LoginView

urlpatterns = [
    # Rutas de Autenticación
    path('login/', LoginView.as_view(),
         name='auth-login'),
    path('refresh/', TokenRefreshView.as_view(),
         name='auth-refresh-token'),

]

# admin_module/views.py

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.contrib.auth import authenticate

from .utils import authenticate_ldap_user

from apps.usuarios.models import Usuarios
from apps.usuarios.serializers.users import UsuarioReadSerializer
# --- 1. Vistas de Autenticación (Requisito 1 y 2) ---


# Importamos y configuramos el logger una sola vez
import logging
# logger = logging.getLogger(__name__)
logger = logging.getLogger(
    "apps.administrar")


class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        username = request.data.get(
            "username")
        password = request.data.get(
            "password")

        if not username or not password:
            return Response({"detail": "Credenciales requeridas."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Verificar si el usuario es 'admin' y existe en PostgreSQL
        if username == 'admin':
            try:
                user = Usuarios.objects.get(
                    username=username)
                # Autenticación solo en PostgreSQL para admin
                user_auth = authenticate(
                    username=username, password=password)
                if user_auth and user_auth.active:
                    # Generar JWT
                    refresh = RefreshToken.for_user(
                        user_auth)
                    user_data = UsuarioReadSerializer(
                        user_auth).data
                    return Response({
                        'access_token': str(refresh.access_token),
                        'refresh_token': str(refresh),
                        'user': user_data,
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({"detail": "Credenciales incorrectas o usuario no autorizado."},
                                    status=status.HTTP_401_UNAUTHORIZED)
            except Usuarios.DoesNotExist:
                return Response({"detail": "Usuario no encontrado."},
                                status=status.HTTP_404_NOT_FOUND)

        # 1. Autenticación contra Active Directory/LDAP para usuarios no admin
        ldap_result = authenticate_ldap_user(
            username, password)

        logger.info(
            f"Resultado de autenticación LDAP: {ldap_result}")

        if ldap_result == 'USER_NOT_FOUND':
            return Response({"detail": "Usuario no existe en el Directorio Activo."},
                            status=status.HTTP_404_NOT_FOUND)

        if ldap_result == 'INVALID_PASSWORD':
            return Response({"detail": "Contraseña incorrecta."},
                            status=status.HTTP_406_NOT_ACCEPTABLE)

        # Otros errores como LDAP_ERROR, BIND_ERROR
        if isinstance(ldap_result, str):
            error_detail = "Error de conexión con el Directorio Activo."
            if settings.DEBUG:
                # En desarrollo, incluir detalles específicos del error
                if ldap_result == 'BIND_ERROR':
                    error_detail = "Error de configuración LDAP: No se pudo conectar con la cuenta de servicio."
                elif ldap_result == 'LDAP_ERROR':
                    error_detail = "Error general de LDAP: Verificar configuración del servidor."
            return Response({"detail": error_detail},
                            status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # 2. Autorización en PostgreSQL (Requisito 2)

        try:
            user = Usuarios.objects.get(
                username=username)

            if not user.active:
                return Response({"detail": "Usuario no autorizado. Contacte al administrador."},
                                status=status.HTTP_403_FORBIDDEN)

        except Usuarios.DoesNotExist:
            # Registrar usuario como pendiente (no activo)
            Usuarios.objects.create_user(
                username=ldap_result['username'],
                email=ldap_result['email'],
                fullname=ldap_result['full_name'],
                # ⚠️ Desactivado por defecto
                active=False,
            )

            return Response({
                "detail": "Usuario autenticado en LDAP, pero pendiente de activación por el administrador."
            }, status=status.HTTP_403_FORBIDDEN)

        # 3️⃣ Generar JWT si el usuario está activo
        refresh = RefreshToken.for_user(
            user)
        user_data = UsuarioReadSerializer(
            user).data

        return Response({
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'user': user_data,
        }, status=status.HTTP_200_OK)

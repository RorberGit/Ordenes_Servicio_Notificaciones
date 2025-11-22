from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from apps.usuarios.models import Usuarios
# from apps.usuarios.permissions import IsAdminRole


class ActivateUserView(APIView):
    """
    Solo los administradores pueden activar o desactivar usuarios.
    Usa el campo Usuarios.active como indicador.
    """
    permission_classes = [
        permissions.IsAuthenticated]

    def patch(self, request, username):
        try:
            user = Usuarios.objects.get(
                username=username)
        except Usuarios.DoesNotExist:
            return Response(
                {"detail": "Usuario no encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )

        active = request.data.get(
            "active")
        if active is None:
            return Response(
                {"detail": "Debe enviar el campo 'active' (true o false)."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Actualizamos tanto active como is_active para mantener coherencia con Django
        user.active = bool(
            active)
        user.is_active = bool(
            active)
        user.save()

        estado = "activado" if user.active else "desactivado"
        return Response(
            {"detail": f"Usuario '{username}' {estado} correctamente."},
            status=status.HTTP_200_OK
        )

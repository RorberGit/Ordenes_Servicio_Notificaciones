from rest_framework import generics, permissions, status
from apps.especialidades.models import Especialidad
from apps.especialidades.serializers import EspecialidadSerializer
from apps.ordenesdeservicio.utils import Parametros
from utils.responses import ApiResponse
from rest_framework.response import Response


class EspecialidadUpdateView(generics.GenericAPIView):
    """
    Vista para actualizar Especialidad usando GenericAPIView.
    Se puede filtrar por 'id' o 'nombre'.
    """
    serializer_class = EspecialidadSerializer
    permission_classes = [
        permissions.IsAuthenticated]

    def get_object(self):
        filtros = Parametros(
            self.request)
        if not filtros:
            return None
        return Especialidad.objects.filter(filtros).first()

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance:
            return Response(
                ApiResponse(
                    success=False,
                    message="Especialidad no encontrada o no se pasó 'id'/'nombre'.").to_dict(),
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(
            instance, data=request.data, partial=True)
        serializer.is_valid(
            raise_exception=True)
        serializer.save()
        return Response(
            ApiResponse(
                success=True,
                message="Espcialidad actualizada exitosamente",
                data=serializer.data).to_dict(),
            status=status.HTTP_200_OK
        )

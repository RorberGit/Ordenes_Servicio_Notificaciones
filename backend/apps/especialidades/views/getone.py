from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from apps.especialidades.models import Especialidad
from apps.especialidades.serializers.especialidades import EspecialidadSerializer
from utils.responses import ApiResponse


class EspecialidadGetOneFilteredView(generics.GenericAPIView):
    """
    Devuelve una especialidad filtrando por id o nombre.
    Ejemplo:
      /api/especialidades/get_one/?id=3
      /api/especialidades/get_one/?nombre=Electricidad
    """

    queryset = Especialidad.objects.all()
    serializer_class = EspecialidadSerializer
    permission_classes = [
        permissions.IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend]
    filterset_fields = [
        'id', 'nombre']

    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(
            self.get_queryset())
        especialidad = queryset.first()

        if not especialidad:
            return Response(
                ApiResponse(
                    success=False,
                    message="No se encontró la especialidad",
                    data=None
                ).to_dict(),
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(
            especialidad)

        return Response(
            ApiResponse(
                success=True,
                message="Especialidad obtenida exitosamente",
                data=serializer.data
            ).to_dict(),
            status=status.HTTP_200_OK
        )

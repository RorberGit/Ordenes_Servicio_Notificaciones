from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from apps.tiposdecontenido.models import TipoContenido
from apps.tiposdecontenido.serializers import TipoContenidoSerializer
from utils.responses import ApiResponse


class TipoContenidoGetOneView(generics.GenericAPIView):
    """
    Devuelve filtrando por id o nombre.
    """

    queryset = TipoContenido.objects.all()
    serializer_class = TipoContenidoSerializer
    permission_classes = [
        permissions.IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend]
    filterset_fields = [
        'id', 'nombre']

    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(
            self.get_queryset())
        tipocontenido = queryset.first()

        if not tipocontenido:
            return Response(
                ApiResponse(
                    success=False,
                    message="No se encontró el Tipo de Contenido",
                    data=None
                ).to_dict(),
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(
            tipocontenido)

        return Response(
            ApiResponse(
                success=True,
                message="Tipo de Contenido obtenido exitosamente",
                data=serializer.data
            ).to_dict(),
            status=status.HTTP_200_OK
        )

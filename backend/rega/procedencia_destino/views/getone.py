from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from rega.procedencia_destino.models import ProcedenciaDestino
from rega.procedencia_destino.serializers import ProcedenciaDestinoSerializer
from utils.responses import ApiResponse


class ProcedenciaDestinoGetOneView(generics.GenericAPIView):
    """
    Devuelve filtrando por id o nombre.
    """

    queryset = ProcedenciaDestino.objects.all()
    serializer_class = ProcedenciaDestinoSerializer
    permission_classes = [
        permissions.IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend]
    filterset_fields = [
        'id', 'cod']

    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(
            self.get_queryset())
        response = queryset.first()

        if not response:
            return Response(
                ApiResponse(
                    success=False,
                    message="No se encontró la procedencia o destino",
                    data=None
                ).to_dict(),
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(
            response)

        return Response(
            ApiResponse(
                success=True,
                message="ProcedenciaDestino obtenida exitosamente",
                data=serializer.data
            ).to_dict(),
            status=status.HTTP_200_OK
        )

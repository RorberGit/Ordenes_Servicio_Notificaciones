from rest_framework import generics, permissions, status

from rega.procedencia_destino.models import ProcedenciaDestino
from rega.procedencia_destino.serializers import ProcedenciaDestinoSerializer
from utils.responses import ApiResponse
from rest_framework.response import Response


class ProcedenciaDestinoUpdateView(generics.GenericAPIView):
    """
    Vista para actualizar usando GenericAPIView.
    Se puede filtrar por 'id' o 'nombre'.
    """
    serializer_class = ProcedenciaDestinoSerializer
    permission_classes = [
        permissions.IsAuthenticated]

    def get_object(self):
        id_param = self.request.query_params.get(
            'id', None)

        if not id_param:
            return None
        return ProcedenciaDestino.objects.filter(id=id_param).first()

    def put(self, request, *args, **kwargs):
        instance = self.get_object()

        if not instance:
            return Response(
                ApiResponse(
                    success=False,
                    message="Procedencia o Destino no encontrado o no se pasó 'id'.").to_dict(),
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
                message="Procedencia Destino actualizada exitosamente",
                data=serializer.data).to_dict(),
            status=status.HTTP_200_OK
        )

from rest_framework import generics, permissions, status

from rega.unidad.models import Unidad
from rega.unidad.serializers import UnidadSerializer
from utils.responses import ApiResponse
from rest_framework.response import Response


class UnidadUpdateView(generics.GenericAPIView):
    """
    Vista para actualizar usando GenericAPIView.
    Se puede filtrar por 'id' o 'nombre'.
    """
    serializer_class = UnidadSerializer
    permission_classes = [
        permissions.IsAuthenticated]

    def get_object(self):
        id_param = self.request.query_params.get(
            'id', None)

        if not id_param:
            return None
        return Unidad.objects.filter(id=id_param).first()

    def put(self, request, *args, **kwargs):
        instance = self.get_object()

        if not instance:
            return Response(
                ApiResponse(
                    success=False,
                    message="Unidad no encontrada o no se pasó 'id'.").to_dict(),
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
                message="Unidad actualizada exitosamente",
                data=serializer.data).to_dict(),
            status=status.HTTP_200_OK
        )

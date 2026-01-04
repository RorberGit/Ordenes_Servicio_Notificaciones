from rest_framework import generics, permissions, status
from rest_framework.response import Response
import logging

from rega.unidad.serializers import UnidadSerializer
from utils.responses import ApiResponse


class UnidadCreateView(generics.CreateAPIView):
    """
    Crear nuevos registros de Obra usando CreateAPIView.
    """
    serializer_class = UnidadSerializer
    permission_classes = [
        permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """
        Override para usar ApiResponse en la respuesta.
        """
        serializer = self.get_serializer(
            data=request.data)
        try:
            serializer.is_valid(
                raise_exception=True)
            self.perform_create(
                serializer)

            return Response(
                ApiResponse(
                    success=True,
                    message="Unidad creada exitosamente.",
                    data=serializer.data
                ).to_dict(),
                status=status.HTTP_201_CREATED
            )

        except Exception:
            logging.getLogger(__name__).exception(
                "Error inesperado al crear la uniad")
            return Response(
                ApiResponse(
                    success=False,
                    message="Error interno del servidor.",
                    data=None
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.exceptions import ValidationError

from rega.registro.models import Registro
from rega.registro.serializaers import RegistroSerializer
from utils.responses import ApiResponse

from rest_framework.parsers import MultiPartParser, FormParser


class RegistroUpdateView(APIView):
    permission_classes = [
        permissions.IsAuthenticated]

    parser_classes = (
        MultiPartParser, FormParser)

    def put(self, request, pk):
        try:
            # Obtener el registro a actualizar
            registro = get_object_or_404(
                Registro, pk=pk)

            # Serializar datos parcialmente
            serializer = RegistroSerializer(
                registro, data=request.data, partial=True)
            serializer.is_valid(
                raise_exception=True)
            serializer.save()

            # Respuesta de éxito
            return Response(ApiResponse(
                success=True,
                message="Registro actualizado exitosamente.",
                data=serializer.data
            ).to_dict(), status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response(ApiResponse(
                success=False,
                message="Datos inválidos para actualizar el registro.",
                data=e.detail
            ).to_dict(), status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(ApiResponse(
                success=False,
                message=f"Error interno del servidor: {str(e)}",
                data=None
            ).to_dict(), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

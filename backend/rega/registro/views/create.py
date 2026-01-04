from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.exceptions import ValidationError
from django.db import models

from rega.registro.models import Registro
from rega.registro.serializaers import RegistroSerializer
from utils.responses import ApiResponse

from rest_framework.parsers import MultiPartParser, FormParser


class RegistroListCreateAPIView(APIView):
    permission_classes = [
        permissions.IsAuthenticated]

    parser_classes = (
        MultiPartParser, FormParser)

    def get(self, request):
        user = request.user
        registros = Registro.objects.filter(
            usuario=user, deleted_at__isnull=True)
        serializer = RegistroSerializer(
            registros, many=True)
        return Response(serializer.data)

    def post(self, request):
        try:
            # Obtener el último número y asignar el siguiente
            ultimo_num = Registro.objects.all().aggregate(
                models.Max('num'))['num__max'] or 0
            num = ultimo_num + 1

            data = request.data.copy()
            data['num'] = num

            # Serializar datos
            serializer = RegistroSerializer(
                data=data)
            serializer.is_valid(
                raise_exception=True)
            serializer.save()

            # Respuesta de éxito
            return Response(ApiResponse(
                success=True,
                message="Registro creado exitosamente.",
                data=serializer.data
            ).to_dict(), status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response(ApiResponse(
                success=False,
                message="Datos inválidos para crear el registro.",
                data=e.detail
            ).to_dict(), status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(ApiResponse(
                success=False,
                message=f"Error interno del servidor: {str(e)}",
                data=None
            ).to_dict(), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

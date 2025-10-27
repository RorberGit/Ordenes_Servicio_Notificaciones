from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from rest_framework import permissions

from apps.proyecto.serializers.proyecto import ProyectoSerializer
from utils.responses import ApiResponse


class ProyectoCreateView(APIView):
    '''
        Vista para insertar nuevos Proyectos
    '''

    permission_classes = [
        permissions.AllowAny]

    def post(self, request):
        """
        Crear un nuevo proyecto.
        """

        try:
            serializer = ProyectoSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            # Success response
            api_response = ApiResponse(
                success=True,
                message="Proyecto creado exitosamente.",
                data=serializer.data,
                status_code=201
            )
        except ValidationError as e:
            # Validation error handling
            api_response = ApiResponse(
                success=False,
                message="Datos inválidos para crear el proyecto.",
                data=e.detail,
                status_code=400
            )
        except Exception as e:
            # Unexpected error handling
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Unexpected error creating proyecto: {str(e)}")
            api_response = ApiResponse(
                success=False,
                message="Error interno del servidor.",
                data=None,
                status_code=500
            )

        return Response(api_response.to_dict(), status=api_response.status_code)
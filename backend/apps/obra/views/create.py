from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from rest_framework import permissions

from apps.obra.serializers.obra import ObraSerializer
from utils.responses import ApiResponse


class ObraCreateView(APIView):
    '''
        Vista para insertar nuevos Obras
    '''

    permission_classes = [
        permissions.IsAuthenticated]

    def post(self, request):
        """
        Crear un nuevo obra.
        """

        try:
            serializer = ObraSerializer(
                data=request.data)
            serializer.is_valid(
                raise_exception=True)
            serializer.save()

            # Success response
            api_response = ApiResponse(
                success=True,
                message="Obra creado exitosamente.",
                data=serializer.data,
                status_code=201
            )
        except ValidationError as e:
            # Validation error handling
            api_response = ApiResponse(
                success=False,
                message="Datos inválidos para crear el obra.",
                data=e.detail,
                status_code=400
            )
        except Exception as e:
            # Unexpected error handling
            import logging
            logger = logging.getLogger(
                __name__)
            logger.error(
                f"Unexpected error creating obra: {str(e)}")
            api_response = ApiResponse(
                success=False,
                message="Error interno del servidor.",
                data=None,
                status_code=500
            )

        return Response(api_response.to_dict(), status=api_response.status_code)

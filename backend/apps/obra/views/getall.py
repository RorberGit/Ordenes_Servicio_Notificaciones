from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from apps.obra.models import Obra
from apps.obra.serializers.obra import ObraSerializer
from apps.ordenesdeservicio.utils import Parametros
from utils.responses import ApiResponse


class ObraGetAllView(APIView):
    '''
        Vista de consulta de todos los registros
    '''
    permission_classes = [
        permissions.IsAuthenticated]

    def get(self, request):
        try:
            # * Obtener los objetos obra
            obras = Obra.objects.filter(
                Parametros(request))

            # * Verificar que se encontraron los resultados
            if not obras.exists():
                api_response = ApiResponse(
                    success=False,
                    message="No se encontraron obras",
                    data=[],
                    status_code=404
                )
            else:
                # * Serializar los objetos
                serializer = ObraSerializer(
                    obras, many=True)

                # * Crear respuesta estandarizada
                api_response = ApiResponse(
                    success=True,
                    message="Obras obtenidos exitosamente",
                    data=serializer.data)
        except Exception as e:
            # * Respuesta a los errores internos del servidor
            api_response = ApiResponse(
                success=False,
                message=f"Ocurrió un error inesperado: {str(e)}",
                data=None,
                status_code=500
            )

        return Response(api_response.to_dict(), status=api_response.status_code)

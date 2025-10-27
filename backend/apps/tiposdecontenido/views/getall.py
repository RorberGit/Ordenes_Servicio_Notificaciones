from rest_framework.views import APIView
from rest_framework.response import Response

from apps.tiposdecontenido.models import TipoContenido
from apps.tiposdecontenido.serializers.tiposdecontenido import TipoContenidoSerializer
from utils.responses import ApiResponse


class TipoContenidoGetAllView(APIView):
    '''
        Vista de consulta de todos los registros de Tipo de Contenido
    '''

    def get(self, request):
        try:
            # * Obtener todos los tipos de contenido
            tipos_contenido = TipoContenido.objects.all()

            # * Verificar que se encontraron los resultados
            if not tipos_contenido.exists():
                api_response = ApiResponse(
                    success=False,
                    message="No se encontraron tipos de contenido",
                    data=[],
                    status_code=404
                )
            else:
                # * Serializar el objeto
                serializer = TipoContenidoSerializer(
                    tipos_contenido, many=True)

                # * Crear respuesta estandarizada
                api_response = ApiResponse(
                    success=True,
                    message="Tipos de contenido obtenidos exitosamente",
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
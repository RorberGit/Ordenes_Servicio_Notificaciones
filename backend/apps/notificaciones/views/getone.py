from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.notificaciones.models.notificaciones import Notificacion
from apps.notificaciones.serializers.notificaciones import NotificacionSerializer

from apps.notificaciones.utils import Parametros
from utils.responses import ApiResponse


class NotificacionGetOneView(APIView):
    '''
        Vista de consulta de un solo registro de Notificacion
    '''

    def get(self, request):
        try:
            # * Obtener filtro
            filtro = Parametros(
                request)

            # * Si no existe un filtro
            if not filtro.children:
                return Response(ApiResponse(
                    success=False,
                    message="Sin filtros para la consulta",
                    data=None
                ).to_dict(), status=status.HTTP_400_BAD_REQUEST)

            # * Obtener el objeto notificacion
            notificacion = Notificacion.objects.get(
                filtro)

            # * Serializar el objeto
            serializer = NotificacionSerializer(
                notificacion)
        except Notificacion.DoesNotExist:
            # * En caso de no tener resultado
            return Response(ApiResponse(
                success=False,
                message="No se encontró el registro",
                data=None
            ).to_dict(), status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # * Respuesta a los errores internos del servidor
            return Response(ApiResponse(
                success=False,
                message=f"Ocurrió un error inesperado: {str(e)}",
                data=None
            ).to_dict(), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # * Crear respuesta satisfactoria
        return Response(ApiResponse(
            success=True,
            message="Orden de servicio obtenida exitosamente",
            data=serializer.data
        ).to_dict(), status=status.HTTP_200_OK)

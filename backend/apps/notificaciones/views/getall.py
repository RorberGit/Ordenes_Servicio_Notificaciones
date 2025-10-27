from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status

from apps.notificaciones.models.notificaciones import Notificacion
from apps.notificaciones.serializers.notificaciones import NotificacionSerializer
from utils.responses import ApiResponse


class NotificacionGetAllView(ListAPIView):
    '''
        Vista optimizada de consulta de todos los registros de Notificacion
        Aprovecha al máximo las características de ListAPIView
    '''
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer

    def get(self, request, *args, **kwargs):
        '''
            Sobrescribe el método get para mantener la respuesta estandarizada
        '''
        try:
            # Usar el método list heredado de ListAPIView
            response = self.list(request, *args, **kwargs)

            # Si no hay datos, personalizar la respuesta
            if not response.data:
                api_response = ApiResponse(
                    success=False,
                    message="No se encontraron notificaciones",
                    data=[],
                    status_code=404
                )
                return Response(api_response.to_dict(), status=status.HTTP_404_NOT_FOUND)

            # Respuesta exitosa con datos
            api_response = ApiResponse(
                success=True,
                message="Notificaciones obtenidas exitosamente",
                data=response.data
            )

            return Response(api_response.to_dict(), status=status.HTTP_200_OK)

        except Exception as e:
            # Respuesta a los errores internos del servidor
            api_response = ApiResponse(
                success=False,
                message=f"Ocurrió un error inesperado: {str(e)}",
                data=None,
                status_code=500
            )
            return Response(api_response.to_dict(), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
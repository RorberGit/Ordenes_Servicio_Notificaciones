from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status, permissions

from apps.tiposdecontenido.models import TipoContenido
from apps.tiposdecontenido.serializers import TipoContenidoSerializer
from utils.responses import ApiResponse


class TiposContenidoGetAllView(ListAPIView):
    '''
        Vista optimizada de consulta de todos los registros de Especialidad
        Aprovecha al máximo las características de ListAPIView
    '''
    queryset = TipoContenido.objects.all()
    serializer_class = TipoContenidoSerializer
    permission_classes = [
        permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        '''
            Sobrescribe el método get para mantener la respuesta estandarizada
        '''
        try:
            # Usar el método list heredado de ListAPIView
            response = self.list(
                request, *args, **kwargs)

            # Si no hay datos, personalizar la respuesta
            if not response.data:
                return Response(
                    ApiResponse(
                        success=False,
                        message="No se encontraron Tipos de Contenidos",
                        data=[]).to_dict(),
                    status=status.HTTP_404_NOT_FOUND
                )

            # Respuesta exitosa con datos
            return Response(
                ApiResponse(
                    success=True,
                    message="Tipos de Contenidos obtenidos exitosamente",
                    data=response.data).to_dict(),
                status=status.HTTP_200_OK
            )

        except Exception as e:
            # Respuesta a los errores internos del servidor
            return Response(
                ApiResponse(
                    success=False,
                    message=f"Ocurrió un error inesperado: {str(e)}",
                    data=None).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

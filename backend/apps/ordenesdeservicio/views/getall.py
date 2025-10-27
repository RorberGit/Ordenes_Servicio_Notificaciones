from rest_framework.views import APIView
from rest_framework.response import Response

from apps.ordenesdeservicio.models.ordenesservico import OrdenesServicio
from apps.ordenesdeservicio.serializers.ordenesservicio import OrdenesServicioSerializer
from apps.ordenesdeservicio.utils import Parametros
from utils.responses import ApiResponse


class OrdenesServicioGetAllView(APIView):
    '''
        Vista de consulta de un solo registro
    '''

    def get(self, request):
        try:
            # * Octener el objecto ordenes de servicio
            ordenservicio = OrdenesServicio.objects.filter(
                Parametros(request))

            # * Verificar que se encontraron los resultados
            if not ordenservicio.exists():
                api_response = ApiResponse(
                    success=False,
                    message="No se encontraron órdenes de servicio",
                    data=[],
                    status_code=404
                )
            else:
                # * Serializar el objecto
                serializer = OrdenesServicioSerializer(
                    ordenservicio, many=True)

                # * Crear respuesta estandarizada
                api_response = ApiResponse(
                    success=True,
                    message="Órdenes de servicio obtenidas exitosamente",
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

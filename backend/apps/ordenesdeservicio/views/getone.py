from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from apps.ordenesdeservicio.models.ordenesservico import OrdenesServicio
from apps.ordenesdeservicio.serializers.ordenesservicio import OrdenesServicioReadSerializer
from apps.ordenesdeservicio.utils import Parametros
from utils.responses import ApiResponse


class OrdenesServicioGetOneView(APIView):
    '''
        Vista de consulta de un solo registro
    '''
    permission_classes = [
        permissions.IsAuthenticated]

    def get(self, request):
        try:
            # * Obtener filtro
            filtro = Parametros(
                request)

            # * Si no existe un filtro
            if not filtro.children:
                api_response = ApiResponse(
                    success=False,
                    message="Sin filtros para la consulta",
                    data=None,
                    status_code=400
                )
                return Response(api_response.to_dict(), status=api_response.status_code)

            # * Obtener el objeto ordenes de servicio
            ordenservicio = OrdenesServicio.objects.get(
                filtro)
        except OrdenesServicio.DoesNotExist:
            # * En caso de no tener resultado
            api_response = ApiResponse(
                success=False,
                message="No se encontró el registro",
                data=None,
                status_code=404
            )
            return Response(api_response.to_dict(), status=api_response.status_code)
        except Exception as e:
            # * Respuesta a los errores internos del servidor
            api_response = ApiResponse(
                success=False,
                message=f"Ocurrió un error inesperado: {str(e)}",
                data=None,
                status_code=500
            )
            return Response(api_response.to_dict(), status=api_response.status_code)

        # * Serializar el objeto
        serializer = OrdenesServicioReadSerializer(
            ordenservicio)

        # * Crear respuesta estandarizada
        api_response = ApiResponse(
            success=True,
            message="Orden de servicio obtenida exitosamente",
            data=serializer.data
        )

        return Response(api_response.to_dict(), status=api_response.status_code)

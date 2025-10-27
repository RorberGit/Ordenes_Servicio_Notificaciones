from rest_framework.views import APIView
from rest_framework.response import Response

from apps.proyecto.models import Proyecto
from apps.proyecto.serializers.proyecto import ProyectoSerializer
from apps.ordenesdeservicio.utils import Parametros
from utils.responses import ApiResponse


class ProyectoGetOneView(APIView):
    '''
        Vista de consulta de un solo registro
    '''

    def get(self, request):
        try:
            # * Obtener filtro
            filtro = Parametros(request)

            # * Si no existe un filtro
            if not filtro.children:
                api_response = ApiResponse(
                    success=False,
                    message="Sin filtros para la consulta",
                    data=None,
                    status_code=400
                )
                return Response(api_response.to_dict(), status=api_response.status_code)

            # * Obtener el objeto proyecto
            proyecto = Proyecto.objects.get(filtro)
        except Proyecto.DoesNotExist:
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
        serializer = ProyectoSerializer(proyecto)

        # * Crear respuesta estandarizada
        api_response = ApiResponse(
            success=True,
            message="Proyecto obtenido exitosamente",
            data=serializer.data
        )

        return Response(api_response.to_dict(), status=api_response.status_code)
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.proyecto.models import Proyecto
from apps.proyecto.serializers.proyecto import ProyectoSerializer
from apps.ordenesdeservicio.utils import Parametros
from utils.responses import ApiResponse


class ProyectoGetAllView(APIView):
    '''
        Vista de consulta de todos los registros
    '''

    def get(self, request):
        try:
            # * Obtener los objetos proyecto
            proyectos = Proyecto.objects.filter(
                Parametros(request))

            # * Verificar que se encontraron los resultados
            if not proyectos.exists():
                api_response = ApiResponse(
                    success=False,
                    message="No se encontraron proyectos",
                    data=[],
                    status_code=404
                )
            else:
                # * Serializar los objetos
                serializer = ProyectoSerializer(
                    proyectos, many=True)

                # * Crear respuesta estandarizada
                api_response = ApiResponse(
                    success=True,
                    message="Proyectos obtenidos exitosamente",
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
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

from apps.proyecto.models import Proyecto
from apps.proyecto.serializers.proyecto import ProyectoSerializer
from utils.responses import ApiResponse


class ProyectoPagination(PageNumberPagination):
    # Número de registros por página
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class ProyectoGetAllPaginatedView(ListAPIView):
    '''
        Vista paginada de consulta de todos los registros de Proyecto
        Recibe parámetros de paginación: page, page_size
    '''
    queryset = Proyecto.objects.all(
    ).order_by("-created_at")
    serializer_class = ProyectoSerializer
    pagination_class = ProyectoPagination

    def get(self, request, *args, **kwargs):
        '''
            Sobrescribe el método get para mantener la respuesta estandarizada con paginación
        '''
        try:
            # Usar el método list heredado de ListAPIView (que incluye paginación)
            response = self.list(
                request, *args, **kwargs)

            # Si no hay datos, personalizar la respuesta
            if not response.data.get('results', []):
                api_response = ApiResponse(
                    success=False,
                    message="No se encontraron proyectos",
                    data={
                        'results': [],
                        'pagination': {
                            'count': 0,
                            'next': None,
                            'previous': None,
                            'current_page': 1,
                            'total_pages': 0
                        }
                    },
                    status_code=404
                )
                return Response(api_response.to_dict(), status=api_response.status_code)

            # Respuesta exitosa con datos paginados
            pagination_info = {
                'count': response.data['count'],
                'next': response.data['next'],
                'previous': response.data['previous'],
                'current_page': self.paginator.page.number if hasattr(self.paginator, 'page') else 1,
                'total_pages': self.paginator.page.paginator.num_pages if hasattr(self.paginator, 'page') else 1
            }

            api_response = ApiResponse(
                success=True,
                message="Proyectos obtenidos exitosamente",
                data={
                    'results': response.data['results'],
                    'pagination': pagination_info
                }
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
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from apps.ordenesdeservicio.models.ordenesservico import OrdenesServicio
from apps.ordenesdeservicio.serializers.ordenesservicio import OrdenesServicioReadSerializer
from utils import ApiResponse, build_paginated_response
from apps.helpers import Filters, Pagination


class OrdenesServicioGetAllPaginatedView(APIView):
    '''
        Vista paginada de consulta de todos los registros de OrdenesServicio
        Recibe parámetros de paginación: page, page_size
        Soporta filtros vía query params, ej: ?id_estado=2
        Filtros especiales: ?filtro=vencidas (fecha_notificacion > 10 días)
        o ?filtro=proximas (3 días antes de 10 días)
    '''
    serializer_class = OrdenesServicioReadSerializer
    # pagination_class = OrdenesServicioPagination
    permission_classes = [
        permissions.IsAuthenticated]

    def get(self, request):
        '''
            Sobrescribe el método get para mantener la respuesta estandarizada con paginación
        '''
        try:
            # Recuperar todos los registros
            queryset = OrdenesServicio.objects.filter(
                Filters(request)).order_by("-created_at")

            paginator = Pagination()
            page = paginator.paginate_queryset(
                queryset, request)

            serializer = OrdenesServicioReadSerializer(
                page, many=True)

            # Si no hay resultados
            if not serializer.data:
                return Response(ApiResponse(
                    success=False,
                    message="No se encontraron órdenes de servicio",
                    data={
                        'results': [],
                        'pagination': {
                            'count': 0,
                            'next': None,
                            'previous': None,
                            'current_page': 1,
                            'total_pages': 0
                        }
                    }
                ).to_dict(), status=status.HTTP_404_NOT_FOUND)

            # Respuesta exitosa
            return Response(ApiResponse(
                success=True,
                message="Órdenes de servicio obtenidas exitosamente",
                data=build_paginated_response(
                    paginator, request, serializer.data)
            ).to_dict(), status=status.HTTP_200_OK)

        except Exception as e:
            # Respuesta a los errores internos del servidor
            return Response(ApiResponse(
                success=False,
                message=f"Ocurrió un error inesperado: {str(e)}",
                data=None,
                status_code=500
            ).to_dict(), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

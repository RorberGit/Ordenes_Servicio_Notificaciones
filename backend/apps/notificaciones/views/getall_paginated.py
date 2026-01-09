from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from apps.notificaciones.models.notificaciones import Notificacion
from apps.notificaciones.serializers.notificaciones import NotificacionSerializer
from utils import ApiResponse, build_paginated_response
from apps.helpers import Filters, Pagination


class NotificacionGetAllPaginatedView(APIView):
    '''
        Vista paginada de consulta de todos los registros de Notificacion
        Recibe parámetros de paginación: page, page_size
        Soporta filtros vía query params, ej: ?id_estado=2
        Filtros especiales: ?filtro=vencidas (fecha_notificacion > 10 días)
        o ?filtro=proximas (3 días antes de 10 días)
    '''
    # Usamos IsAuthenticated para asegurar que solo usuarios logueados puedan crear
    permission_classes = [
        permissions.IsAuthenticated]
    serializer_class = NotificacionSerializer

    def get(self, request):
        '''
            Sobrescribe el método get para mantener la respuesta estandarizada con paginación
        '''
        try:
            # Recuperar todos los registros
            queryset = Notificacion.objects.filter(
                Filters(request)).order_by("-created_at")

            paginator = Pagination()
            page = paginator.paginate_queryset(
                queryset, request)

            serializer = NotificacionSerializer(
                page, many=True)

            # Si no hay resultados
            if not serializer.data:
                return Response(ApiResponse(
                    success=False,
                    message="No se encontraron notificaciones",
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
                message="Notificaciones obtenidas exitosamente",
                data=build_paginated_response(
                    paginator, request, serializer.data)
            ).to_dict(), status=status.HTTP_200_OK)

        except Exception as e:
            # Respuesta a los errores internos del servidor
            api_response = ApiResponse(
                success=False,
                message=f"Ocurrió un error inesperado: {str(e)}",
                data=None
            )
            return Response(api_response.to_dict(), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.pagination import PageNumberPagination
from django.utils import timezone
from datetime import timedelta

from apps.notificaciones.models.notificaciones import Notificacion
from apps.notificaciones.serializers.notificaciones import NotificacionSerializer
from utils.responses import ApiResponse
from utils.paginated_response import build_paginated_response


class NotificacionPagination(PageNumberPagination):
    # Número de registros por página
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


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
            query = Q()

            # Recuperar estado
            estado = request.query_params.get(
                'estado', None)
            # Si estado existe
            if estado is not None:
                hoy = timezone.localtime(
                    timezone.now()).date()

                if estado == 'vencidas':
                    # Órdenes con fecha_notificacion pasada de 10 días (más de 10 días)
                    fecha_limite = hoy - \
                        timedelta(
                            days=10)
                    query &= Q(
                        fecha_notificacion__lt=fecha_limite, fecha_notificacion__isnull=False)
                    # Si están en progreso
                    query &= Q(
                        estado_id__exact=2)
                elif estado == 'proximas':
                    # Órdenes próximas a vencerse: 3 días antes de los 10 días (entre 7 y 10 días atrás)
                    fecha_inicio = hoy - \
                        timedelta(
                            days=10)
                    fecha_fin = hoy - \
                        timedelta(
                            days=7)
                    query = Q(
                        fecha_notificacion__range=(
                            fecha_inicio, fecha_fin),
                        fecha_notificacion__isnull=False
                    )
                    # Si están en progreso
                    query &= Q(
                        estado_id__exact=2)
                else:
                    query &= Q(
                        estado_id__exact=estado)

            # Recuperar todos los registros
            queryset = Notificacion.objects.filter(
                query).order_by("-created_at")

            paginator = NotificacionPagination()
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

from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.pagination import PageNumberPagination
from django.utils import timezone
from datetime import timedelta

from apps.notificaciones.models.notificaciones import Notificacion
from apps.notificaciones.serializers.notificaciones import NotificacionSerializer
from utils.responses import ApiResponse


class NotificacionPagination(PageNumberPagination):
    # Número de registros por página
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class NotificacionGetAllPaginatedView(ListAPIView):
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
    pagination_class = NotificacionPagination

    def get_queryset(self):
        queryset = Notificacion.objects.all(
        ).order_by("-created_at")
        filtro = self.request.GET.get(
            'filtro')
        hoy = timezone.localtime(
            timezone.now()).date()

        print(hoy)

        if filtro == 'vencidas':
            # Órdenes con fecha_notificacion pasada de 10 días (más de 10 días)
            fecha_limite = hoy - \
                timedelta(
                    days=10)
            queryset = queryset.filter(
                fecha_notificacion__lt=fecha_limite, fecha_notificacion__isnull=False)
        elif filtro == 'proximas':
            # Órdenes próximas a vencerse: 3 días antes de los 10 días (entre 7 y 10 días atrás)
            fecha_inicio = hoy - timedelta(
                days=10)
            fecha_fin = hoy - timedelta(
                days=7)
            queryset = queryset.filter(
                fecha_notificacion__range=(
                    fecha_inicio, fecha_fin),
                fecha_notificacion__isnull=False
            )

        # Aplicar filtros dinámicos desde query params
        for param, value in self.request.GET.items():
            if param in ['page', 'page_size', 'filtro']:
                continue  # Ignorar parámetros de paginación y filtro especial
            # Mapear id_estado a estado_id
            if param == 'id_estado':
                queryset = queryset.filter(
                    estado_id=value)
            # Para otros campos, filtrar directamente si existen en el modelo
            elif hasattr(Notificacion, param):
                filter_kwargs = {
                    param: value}
                queryset = queryset.filter(
                    **filter_kwargs)
        return queryset

    def list(self, request, *args, **kwargs):
        '''
            Sobrescribe el método get para mantener la respuesta estandarizada con paginación
        '''
        try:
            # Usar el método list heredado de ListAPIView (que incluye paginación)
            response = super().list(
                request, *args, **kwargs)

            # Si no hay datos, personalizar la respuesta
            if not response.data.get('results', []):
                api_response = ApiResponse(
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
                )
                return Response(api_response.to_dict(), status=status.HTTP_404_NOT_FOUND)

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
                message="Notificaciones obtenidas exitosamente",
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
                data=None
            )
            return Response(api_response.to_dict(), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

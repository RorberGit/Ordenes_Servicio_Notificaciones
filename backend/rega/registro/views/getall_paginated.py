from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.pagination import PageNumberPagination

from rega.registro.models import Registro
from rega.registro.serializaers import RegistroSerializer
from utils.responses import ApiResponse


class RegistroPagination(PageNumberPagination):
    # Número de registros por página
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class RegistroGetAllPaginatedView(ListAPIView):
    '''
        Vista paginada de consulta de todos los registros de Registro
        Recibe parámetros de paginación: page, page_size
        Filtros opcionales: unidad (descripción), usuario (username), anio (año de creación)
    '''
    serializer_class = RegistroSerializer
    pagination_class = RegistroPagination
    permission_classes = [
        permissions.AllowAny]

    def get_queryset(self):
        # Filtrar todo
        queryset = Registro.objects.all(
        ).order_by("-created_at")

        # Filtro por descripción del registro
        descripcion = self.request.GET.get(
            'descripcion')
        if descripcion:
            queryset = queryset.filter(
                descripcion__icontains=descripcion)

        # Filtro por entrada/salida
        EntSal = self.request.GET.get(
            'ent_sal')
        if EntSal:
            queryset = queryset.filter(
                ent_sal__icontains=EntSal)

        # Filtro por procedencia o destino
        procedencia_destino = self.request.GET.get(
            'procedencia_destino')
        if procedencia_destino:
            queryset = queryset.filter(
                procedencia_destino__descripcion__icontains=procedencia_destino)

        # Filtro por tipo de documento
        tipo_documento = self.request.GET.get(
            'tipo_documento')
        if tipo_documento:
            queryset = queryset.filter(
                tipo_documento__descripcion__icontains=tipo_documento)

        # Filtro por descripción de la unidad
        unidad = self.request.GET.get(
            'unidad')
        if unidad:
            queryset = queryset.filter(
                unidad__descripcion__icontains=unidad)

        # Filtro por username del usuario
        usuario = self.request.GET.get(
            'usuario')
        if usuario:
            queryset = queryset.filter(
                usuario__username__icontains=usuario)

        # Filtro por año específico
        anio = self.request.GET.get(
            'anio')
        if anio:
            try:
                anio = int(
                    anio)
                queryset = queryset.filter(
                    created_at__year=anio)
            except ValueError:
                pass  # Ignorar si no es un número válido

        return queryset

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
                return Response(ApiResponse(
                    success=False,
                    message="No se encontraron registros",
                    data={
                        'results': [],
                        'pagination': {
                            'count': 0,
                            'next': None,
                            'previous': None,
                            'current_page': 1,
                            'total_pages': 0
                        }
                    }).to_dict(),
                    status=status.HTTP_404_NOT_FOUND
                )

            # Respuesta exitosa con datos paginados
            pagination_info = {
                'count': response.data['count'],
                'next': response.data['next'],
                'previous': response.data['previous'],
                'current_page': self.paginator.page.number if hasattr(self.paginator, 'page') else 1,
                'total_pages': self.paginator.page.paginator.num_pages if hasattr(self.paginator, 'page') else 1
            }

            return Response(
                ApiResponse(
                    success=True,
                    message="Registros obtenidos exitosamente",
                    data={
                        'results': response.data['results'],
                        'pagination': pagination_info
                    }).to_dict(),
                status=status.HTTP_200_OK
            )

        except Exception as e:
            # Respuesta a los errores internos del servidor
            api_response = ApiResponse(
                success=False,
                message=f"Ocurrió un error inesperado: {str(e)}",
                data=None,
                status_code=500
            )
            return Response(api_response.to_dict(), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

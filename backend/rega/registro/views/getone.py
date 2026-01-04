# views.py
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions

from rega.registro.models import Registro
from rega.registro.serializaers import RegistroHistorySerializer, RegistroSerializer
from utils.responses import ApiResponse

from django.shortcuts import get_object_or_404


class RegistroDetailWithHistoryAPIView(APIView):
    permission_classes = [
        permissions.AllowAny]

    def get(self, request):
        try:
            lookup_filters = {}

            # Buscar por parámetros
            registro_id = request.query_params.get(
                'id')

            if registro_id:
                lookup_filters['id'] = registro_id
            else:
                api_response = ApiResponse(
                    success=False,
                    message="Sin filtros para la consulta",
                    data=None,
                    status_code=400
                )

                return Response(api_response.to_dict(), status=api_response.status_code)

            # Buscar el usuario usando los filtros. get_object_or_404 maneja el 404
            try:
                registro = get_object_or_404(
                    Registro, **lookup_filters)
            except Exception as e:
                # Esto captura cualquier error potencial en la búsqueda (ej: QuerySet)
                api_response = ApiResponse(
                    success=False,
                    message="Error al obtener el registro.",
                    data=str(
                        e),
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                return Response(api_response.to_dict(), status=api_response.status_code)

            # Registro actual
            registro_serializer = RegistroSerializer(
                registro)

            # Historial completo
            history_qs = Registro.history.filter(
                id=registro.id).order_by('-history_date')
            history_serializer = RegistroHistorySerializer(
                history_qs, many=True)

            # Combinar en un solo payload
            combined_data = {
                "registro_actual": registro_serializer.data,
                "historial": history_serializer.data
            }

            return Response(ApiResponse(
                success=True,
                message="Registro obtenido exitosamente",
                data=combined_data
            ).to_dict(), status=status.HTTP_200_OK)

        except Exception as e:
            return Response(ApiResponse(
                success=False,
                message=f"Error interno del servidor: {str(e)}",
                data=None,
                status_code=500
            ).to_dict(), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

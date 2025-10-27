from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
import logging

from apps.comun.models import Estado
from apps.notificaciones.models.notificaciones import HistoricoNotificacion, Notificacion
from apps.notificaciones.serializers.notificaciones import NotificacionSerializer
from apps.notificaciones.utils import Parametros
from apps.usuarios.models import Usuarios
from utils.responses import ApiResponse

logger = logging.getLogger(
    __name__)


class NotificacionUpdateView(APIView):
    """
    Vista para la actualización de los datos de las Notificaciones.
    Parámetros esperados:
        - numero_notificacion (query param)
        - id (query param)
        - username, estado, resumen (en body)
    """

    def put(self, request):
        try:
            # Obtener el filtro Q
            filtros = Parametros(
                request)

            # Buscar la notificación usando el filtro Q
            notificacion_actual = Notificacion.objects.filter(
                filtros).first()
            if not notificacion_actual:
                return Response(
                    ApiResponse(
                        success=False,
                        message="Notificación no encontrada.",
                        data=None,
                        status_code=status.HTTP_404_NOT_FOUND
                    ).to_dict(),
                    status=status.HTTP_404_NOT_FOUND
                )

            # Validar datos de histórico
            historico_data = request.data.get(
                "historico", {})
            if not historico_data:
                raise ValidationError(
                    {"historico": "El objeto 'historico' es requerido en el cuerpo de la petición."})

            username = historico_data.get(
                "username")
            nuevo_estado = historico_data.get(
                "estado")
            nuevo_resumen = historico_data.get(
                "resumen")

            if not username:
                raise ValidationError(
                    {"username": "El campo 'username' dentro de 'historico' es requerido."})

            # Validar existencia del usuario
            user = get_object_or_404(
                Usuarios, username=username)
            # Validar existencia del estado
            estado = get_object_or_404(
                Estado, id=nuevo_estado)

            # Remover 'historico' del data para evitar conflictos en el serializer
            data = {
                **request.data}
            data.pop(
                'historico', None)
            data['estado'] = estado.id

            logger.info(
                f"Datos dentro del request {data} estos analizar")

            # Serializar datos parcialmente
            serializer = NotificacionSerializer(
                notificacion_actual, data=data, partial=True)
            serializer.is_valid(
                raise_exception=True)
            notificacion_actualizada = serializer.save()

            # Registrar histórico
            HistoricoNotificacion.objects.create(
                notificacion=notificacion_actualizada,
                estado=estado,
                user=user,
                resumen=nuevo_resumen
            )
            logger.info(
                f"Histórico creado para notificación {notificacion_actualizada.numero_notificacion} "
                f"con estado '{estado.nombre}'."
            )

            # Respuesta exitosa
            return Response(
                ApiResponse(
                    success=True,
                    message="Notificación actualizada exitosamente.",
                    data=serializer.data
                ).to_dict(),
                status=status.HTTP_200_OK
            )

        except ValidationError as e:
            # 🔹 Registro detallado del error de validación
            logger.error(
                f"Error de validación al actualizar la notificación. "
                f"Detalles: {e.detail if hasattr(e, 'detail') else str(e)}"
            )
            return Response(
                ApiResponse(
                    success=False,
                    message="Datos inválidos para actualizar la notificación.",
                    data=e.detail
                ).to_dict(),
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception:
            logger.exception(
                "Error inesperado al actualizar la notificación.")
            return Response(
                ApiResponse(
                    success=False,
                    message="Error interno del servidor.",
                    data=None
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

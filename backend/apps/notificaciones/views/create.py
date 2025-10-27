from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
# Importamos la constante 'status' para mejor legibilidad
from rest_framework import permissions, status
from rest_framework.exceptions import ValidationError

from apps.comun.models import Estado
from apps.notificaciones.serializers.notificaciones import NotificacionSerializer
from apps.notificaciones.models.notificaciones import HistoricoNotificacion
from apps.proyecto.models import Proyecto
from apps.usuarios.models import Usuarios
from utils.responses import ApiResponse

# Importamos y configuramos el logger una sola vez
import logging
# logger = logging.getLogger(__name__)
logger = logging.getLogger(
    "apps.notificaciones")


class NotificacionCreateView(APIView):
    '''
    Vista para insertar nuevas Notificaciones.
    '''

    # Usamos IsAuthenticated para asegurar que solo usuarios logueados puedan crear
    permission_classes = [
        permissions.AllowAny
    ]

    def post(self, request):
        """
        Crear una nueva notificación.
        """

        try:
            # Obtener el username del request.data
            username = request.data.get(
                'username')
            if not username:
                raise ValidationError(
                    {"username": "El campo 'username' dentro de 'historico' es requerido."})

            # Validar existencia del usuario
            user = get_object_or_404(
                Usuarios, username=username)

            # Obtener el nombre del proyecto
            nombre_proyecto = request.data.get(
                'proyecto')
            if not nombre_proyecto:
                raise ValidationError(
                    {"proyecto": "El campo 'proyecto' es requerido."})

            # Obtener el estado
            nuevo_estado = request.data.get(
                'estado')
            if not nuevo_estado:
                raise ValidationError(
                    {"estado": "El campo 'estado' es requerido"})

            # Validar existencia del proyecto
            proyecto = get_object_or_404(
                Proyecto, nombre=nombre_proyecto)

            estado = get_object_or_404(
                Estado, id=nuevo_estado)

            logger.info(
                f"guardar desde el request {request.data}")

            data = request.data.copy()
            data["proyecto"] = proyecto.id
            data["estado"] = estado.id

            # Serializar datos directamente con request.data
            serializer = NotificacionSerializer(
                data=data)
            serializer.is_valid(
                raise_exception=True)
            # Guardar la Notificación con el número asignado
            nueva_notificacion = serializer.save()

            # Crear registro histórico
            HistoricoNotificacion.objects.create(
                notificacion=nueva_notificacion,
                estado=estado,
                user=user,
                resumen=f"Notificación #{nueva_notificacion.numero_notificacion} creada."
            )
            logger.info(
                f"Histórico creado para notificación {nueva_notificacion.numero_notificacion}."
            )

            # Respuesta de Éxito: Usando la constante de status de DRF
            return Response(ApiResponse(
                success=True,
                message="Notificación creada exitosamente.",
                data=serializer.data
            ).to_dict(), status=status.HTTP_201_CREATED)

        except ValidationError as e:
            # 🔹 Registro detallado del error de validación
            logger.error(
                f"Error de validación al crear la notificación. "
                f"Detalles: {e.detail if hasattr(e, 'detail') else str(e)}"
            )
            # Manejo de error de validación
            return Response(ApiResponse(
                success=False,
                message="Datos inválidos para crear la notificación.",
                # e.detail contiene los errores del serializador
                data=e.detail
            ).to_dict(), status=status.HTTP_400_BAD_REQUEST)

        except Exception:
            # Manejo de errores inesperados (DB, lógica, etc.)
            logger.exception(
                "Error inesperado al crear la notificación.")

            return Response(ApiResponse(
                success=False,
                message="Error interno del servidor.",
                data=None
            ).to_dict(), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
# Importamos la constante 'status' para mejor legibilidad
from rest_framework import permissions, status
from rest_framework.exceptions import ValidationError
from django.db import models

from apps.comun.models import Estado
from apps.ordenesdeservicio.serializers.ordenesservicio import OrdenesServicioSerializer
from apps.ordenesdeservicio.models.ordenesservico import OrdenesServicio, HistoricoOS
from apps.proyecto.models import Proyecto
from apps.usuarios.models import Usuarios
from apps.tiposdecontenido.models import TipoContenido
from utils.responses import ApiResponse

# Importamos y configuramos el logger una sola vez
import logging
# logger = logging.getLogger(__name__)
logger = logging.getLogger(
    "apps.ordenesdeservicio")


class OrdenesServicioCreateView(APIView):
    '''
    Vista para insertar nuevas Ordenes de Servicio.
    '''

    # Usamos IsAuthenticated para asegurar que solo usuarios logueados puedan crear
    permission_classes = [
        permissions.AllowAny
    ]

    def post(self, request):
        """
        Crear una nueva orden de servicio.
        """

        try:
            # Obtener el último número de orden y asignar el siguiente
            ultimo_numero = OrdenesServicio.objects.all().aggregate(
                models.Max('numero_orden'))['numero_orden__max'] or 0
            numero_orden = ultimo_numero + 1

            # Obtener el username del request.data
            username = request.data.get(
                'username')
            if not username:
                raise ValidationError(
                    {"username": "El campo 'username' dentro de 'historico' es requerido."})

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

            # Obtener el Tipo Contenido
            nombre_tipo_contenido = request.data.get(
                'tipo_contenido')
            if not nombre_tipo_contenido:
                raise ValidationError(
                    {"estado": "El campo 'estado' es requerido"})

            # Validar existencia del proyecto
            proyecto = get_object_or_404(
                Proyecto, nombre=nombre_proyecto)

            # Validar existencia del usuario
            user = get_object_or_404(
                Usuarios, username=username)

            # Validar existencia de estado
            estado = get_object_or_404(
                Estado, id=nuevo_estado)

            tipo_contenido = get_object_or_404(
                TipoContenido, nombre=nombre_tipo_contenido
            )

            logger.info(
                f"guardar desde el request {request.data}")

            data = request.data.copy()
            data["numero_orden"] = numero_orden
            data["proyecto"] = proyecto.id
            data["estado"] = estado.id
            data['tipo_contenido'] = tipo_contenido.id

            # Serializar datos directamente con request.data
            serializer = OrdenesServicioSerializer(
                data=data)
            serializer.is_valid(
                raise_exception=True)
            # Guardar la Orden de Servicio con el número asignado
            nueva_orden = serializer.save()

            # Crear registro histórico
            HistoricoOS.objects.create(
                estado=estado,
                orden_servicio=nueva_orden,
                user=user,
                resumen=f"Orden de servicio #{nueva_orden.numero_orden} creada."
            )
            logger.info(
                f"Histórico creado para orden {nueva_orden.numero_orden}."
            )

            # Respuesta de Éxito: Usando la constante de status de DRF
            return Response(ApiResponse(
                success=True,
                message="Orden de servicio creada exitosamente.",
                data=serializer.data
            ).to_dict(), status=status.HTTP_201_CREATED)

        except ValidationError as e:
            # 🔹 Registro detallado del error de validación
            logger.error(
                f"Error de validación al crear la orden de servicio. "
                f"Detalles: {e.detail if hasattr(e, 'detail') else str(e)}"
            )
            # Manejo de error de validación
            return Response(ApiResponse(
                success=False,
                message="Datos inválidos para crear la orden de servicio.",
                # e.detail contiene los errores del serializador
                data=e.detail
            ).to_dict(), status=status.HTTP_400_BAD_REQUEST)

        except Exception:
            # Manejo de errores inesperados (DB, lógica, etc.)
            logger.exception(
                "Error inesperado al crear la orden de servicio.")

            return Response(ApiResponse(
                success=False,
                message="Error interno del servidor.",
                data=None
            ).to_dict(), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

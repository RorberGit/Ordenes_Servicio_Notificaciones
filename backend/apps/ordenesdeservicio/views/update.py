from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
import logging

from apps.comun.models import Estado
from apps.ordenesdeservicio.models.ordenesservico import HistoricoOS, OrdenesServicio
from apps.ordenesdeservicio.serializers.ordenesservicio import OrdenesServicioSerializer
from apps.ordenesdeservicio.utils import Parametros
from apps.usuarios.models import Usuarios
from utils.responses import ApiResponse

logger = logging.getLogger(
    __name__)


class OrdenesServicioUpdateView(APIView):
    """
    Vista para la actualización de los datos de las Ordenes de Servicio.
    Parámetros esperados:
        - numero_orden (query param)
        - id (query param)
        - username, estado, resumen (en body)
    """

    def put(self, request):
        try:
            # Obtener el filtro Q
            filtros = Parametros(
                request)

            # Buscar la orden usando el filtro Q
            orden_actual = OrdenesServicio.objects.filter(
                filtros).first()
            if not orden_actual:
                return Response(
                    ApiResponse(
                        success=False,
                        message="Orden de servicio no encontrada.",
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

            # Obtener la instancia de Estado si nuevo_estado es un ID
            if nuevo_estado:
                try:
                    estado_instance = Estado.objects.get(
                        id=nuevo_estado)
                except Estado.DoesNotExist:
                    raise ValidationError(
                        {"estado": f"El estado con ID {nuevo_estado} no existe."})
            else:
                estado_instance = None

            # Remover 'historico' del data para evitar conflictos en el serializer
            data = {
                **request.data}
            data.pop(
                'historico', None)
            data['estado'] = estado_instance.id

            logger.info(
                f"Datos dentro del request {data} estos analizar")

            # Serializar datos parcialmente
            serializer = OrdenesServicioSerializer(
                orden_actual, data=data, partial=True)
            serializer.is_valid(
                raise_exception=True)
            orden_actualizada = serializer.save()

            # Registrar histórico
            HistoricoOS.objects.create(
                orden_servicio=orden_actualizada,
                estado=estado_instance,
                user=user,
                resumen=nuevo_resumen
            )
            logger.info(
                f"Histórico creado para orden {orden_actualizada.numero_orden} con estado '{nuevo_estado}'."
            )

            # Respuesta exitosa
            return Response(
                ApiResponse(
                    success=True,
                    message="Orden de servicio actualizada exitosamente.",
                    data=serializer.data,
                    status_code=status.HTTP_200_OK
                ).to_dict(),
                status=status.HTTP_200_OK
            )

        except ValidationError as e:
            # 🔹 Registro detallado del error de validación
            logger.error(
                f"Error de validación al actualizar la orden de servicio. "
                f"Detalles: {e.detail if hasattr(e, 'detail') else str(e)}"
            )
            return Response(
                ApiResponse(
                    success=False,
                    message="Datos inválidos para actualizar la orden de servicio.",
                    data=e.detail,
                    status_code=status.HTTP_400_BAD_REQUEST
                ).to_dict(),
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception:
            logger.exception(
                "Error inesperado al actualizar la orden de servicio.")
            return Response(
                ApiResponse(
                    success=False,
                    message="Error interno del servidor.",
                    data=None,
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

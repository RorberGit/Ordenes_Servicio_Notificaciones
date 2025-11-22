from rest_framework import serializers

from apps.comun.models import Estado
from apps.especialidades.models import Especialidad
from apps.especialidades.serializers.especialidades import EspecialidadSerializer
from apps.notificaciones.models.notificaciones import Notificacion, HistoricoNotificacion
from apps.ordenesdeservicio.models.ordenesservico import OrdenesServicio
from apps.obra.models import Obra
from apps.tiposdecontenido.models import TipoContenido
from apps.tiposdecontenido.serializers.tiposdecontenido import TipoContenidoSerializer


class HistoricoNotificacionSerializer(serializers.ModelSerializer):
    '''
        Serializer para el modelo HistoricoNotificacion
    '''
    user = serializers.StringRelatedField(
        read_only=True)
    resumen = serializers.CharField(
        read_only=True)
    estado = serializers.StringRelatedField(
        read_only=True)

    class Meta:
        model = HistoricoNotificacion
        fields = [
            'id', 'notificacion', 'estado', 'fecha', 'user', 'resumen']


class NotificacionSerializer(serializers.ModelSerializer):
    '''
        Serializer para el modelo Notificacion
    '''

    # Campos de escritura (write_only)
    especialidad = serializers.PrimaryKeyRelatedField(
        queryset=Especialidad.objects.all(), many=True, required=False, write_only=True)
    obra = serializers.PrimaryKeyRelatedField(
        queryset=Obra.objects.all(), required=False, write_only=True)
    numero_orden_respuesta = serializers.PrimaryKeyRelatedField(
        queryset=OrdenesServicio.objects.all(), required=False, write_only=True)
    tipo_respuesta = serializers.PrimaryKeyRelatedField(
        queryset=TipoContenido.objects.all(), required=False, write_only=True)
    estado = serializers.PrimaryKeyRelatedField(
        queryset=Estado.objects.all(), required=False, write_only=True)

    # Campos de lectura (read_only)
    especialidad_read = EspecialidadSerializer(
        many=True, read_only=True, source='especialidad')
    obra_read = serializers.StringRelatedField(
        read_only=True, source='obra')
    numero_orden_respuesta_read = serializers.StringRelatedField(
        read_only=True, source='numero_orden_respuesta')
    tipo_respuesta_read = TipoContenidoSerializer(
        read_only=True, source='tipo_respuesta')
    estado_read = serializers.StringRelatedField(
        read_only=True, source='estado')
    historicos = HistoricoNotificacionSerializer(
        many=True, read_only=True)

    class Meta:
        model = Notificacion
        fields = [
            'id', 'numero_notificacion', 'asunto', 'fecha_notificacion',
            'lleva_respuesta', 'especialidad', 'especialidad_read', 'obra', 'obra_read',
            'numero_orden_respuesta', 'numero_orden_respuesta_read', 'tipo_respuesta', 'tipo_respuesta_read',
            'estado', 'estado_read', 'historicos'
        ]
        read_only_fields = [
            'id']

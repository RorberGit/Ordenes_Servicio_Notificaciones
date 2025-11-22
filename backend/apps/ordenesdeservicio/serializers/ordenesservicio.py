from rest_framework import serializers

from apps.comun.models import Estado
from apps.especialidades.models import Especialidad
from apps.especialidades.serializers.especialidades import EspecialidadSerializer
from apps.notificaciones.models.notificaciones import Notificacion
from apps.notificaciones.serializers.notificaciones import NotificacionSerializer
from apps.ordenesdeservicio.models.ordenesservico import OrdenesServicio, HistoricoOS
from apps.obra.models import Obra
from apps.tiposdecontenido.models import TipoContenido
from apps.tiposdecontenido.serializers.tiposdecontenido import TipoContenidoSerializer


class HistoricoOSSerializer(serializers.ModelSerializer):
    '''
        Serializer para el modelo HistoricoOS
    '''
    user = serializers.StringRelatedField(
        read_only=True)
    resumen = serializers.CharField(
        read_only=True)
    estado = serializers.StringRelatedField(
        read_only=True)

    class Meta:
        model = HistoricoOS
        fields = [
            'id', 'orden_servicio', 'estado', 'fecha', 'user', 'resumen'
        ]


class OrdenesServicioSerializer(serializers.ModelSerializer):
    '''
        Serializer para el modelo Ordenes de Servicio
    '''

    # Campos de escritura (write_only)
    especialidad = serializers.PrimaryKeyRelatedField(
        queryset=Especialidad.objects.all(), many=True, required=False, write_only=True)
    tipo_contenido = serializers.PrimaryKeyRelatedField(
        queryset=TipoContenido.objects.all(), required=False, write_only=True)
    notificacion = serializers.PrimaryKeyRelatedField(
        queryset=Notificacion.objects.all(), required=False, write_only=True)
    obra = serializers.PrimaryKeyRelatedField(
        queryset=Obra.objects.all(), required=False, write_only=True)
    estado = serializers.PrimaryKeyRelatedField(
        queryset=Estado.objects.all(), required=False, write_only=True)

    # Campos de lectura (read_only)
    especialidad_read = EspecialidadSerializer(
        many=True, read_only=True, source='especialidad')
    tipo_contenido_read = TipoContenidoSerializer(
        read_only=True, source='tipo_contenido')
    notificacion_read = NotificacionSerializer(
        read_only=True, source='notificacion')
    obra_read = serializers.StringRelatedField(
        read_only=True, source='obra')
    estado_read = serializers.StringRelatedField(
        read_only=True, source='estado')
    historicos = HistoricoOSSerializer(
        many=True, read_only=True)

    class Meta:
        model = OrdenesServicio
        fields = [
            'id', 'numero_orden', 'asunto', 'fecha_notificacion',
            'notificacion', 'notificacion_read', 'tipo_contenido', 'tipo_contenido_read',
            'especialidad', 'especialidad_read', 'obra', 'obra_read',
            'estado', 'estado_read', 'historicos'
        ]
        read_only_fields = [
            'id']


class OrdenesServicioReadSerializer(serializers.ModelSerializer):
    notificacion_id_nombre = serializers.StringRelatedField(
        source='notificacion', read_only=True)
    tipo_contenido_nombre = serializers.CharField(
        source='tipo_contenido.nombre', read_only=True)
    obra_nombre = serializers.CharField(
        source='obra.nombre', read_only=True)
    estado_nombre = serializers.CharField(
        source='estado.nombre', read_only=True)
    especialidades = EspecialidadSerializer(
        source='especialidad', many=True, read_only=True)
    historicos = HistoricoOSSerializer(
        many=True, read_only=True)

    class Meta:
        model = OrdenesServicio
        fields = ['id', 'numero_orden', 'asunto', 'fecha_notificacion',
                  'notificacion_id_nombre', 'tipo_contenido_nombre', 'obra_nombre',
                  'estado_nombre', 'especialidades', 'historicos']

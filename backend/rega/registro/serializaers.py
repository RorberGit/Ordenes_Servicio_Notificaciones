from rest_framework import serializers

from apps.usuarios.models import Usuarios
from apps.usuarios.serializers.users import UsuarioReadSerializer
from rega.procedencia_destino.models import ProcedenciaDestino
from rega.procedencia_destino.serializers import ProcedenciaDestinoSerializer
from rega.registro.models import Registro
from rega.tipo_documento.models import TipoDocumento
from rega.tipo_documento.serializers import TipoDocumentoSerializer
from rega.unidad.models import Unidad
from rega.unidad.serializers import UnidadSerializer

""" usuario = UsuarioSerializer(
        read_only=True)
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(), source='usuario', write_only=True
    ) """


class RegistroSerializer(serializers.ModelSerializer):
    usuario = UsuarioReadSerializer(
        read_only=True)
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuarios.objects.all(), source='usuario', write_only=True
    )

    # Mostrar unidad completa
    unidad = UnidadSerializer(
        read_only=True)

    # Para crear/actualizar por ID de unidad
    unidad_id = serializers.PrimaryKeyRelatedField(
        queryset=Unidad.objects.all(),
        source='unidad',
        write_only=True,
        required=False
    )

    # Mostrar procedencia_destino completa
    procedencia_destino = ProcedenciaDestinoSerializer(
        read_only=True)

    # Para crear/actualizar por ID de procedencia_destino
    procedencia_destino_id = serializers.PrimaryKeyRelatedField(
        queryset=ProcedenciaDestino.objects.all(),
        source='procedencia_destino',
        write_only=True,
        required=False
    )

    # Mostrar tipo_documento completa
    tipo_documento = TipoDocumentoSerializer(
        read_only=True)

    # Para crear/actualizar por ID de tipo_documento
    tipo_documento_id = serializers.PrimaryKeyRelatedField(
        queryset=TipoDocumento.objects.all(),
        source='tipo_documento',
        write_only=True,
        required=False
    )

    class Meta:
        model = Registro
        fields = "__all__"


class RegistroHistorySerializer(serializers.ModelSerializer):
    # Nombre del usuario que hizo la acción
    history_user_nombre = serializers.SerializerMethodField()
    # Mostrar tipo de acción legible
    history_type_display = serializers.SerializerMethodField()
    # Mostrar unidad relacionada (solo lectura)
    unidad = UnidadSerializer(
        read_only=True)
    # Mostrar procedencia_destino relacionada (solo lectura)
    procedencia_destino = ProcedenciaDestinoSerializer(
        read_only=True)
    # Mostrar tipo_documento relacionada (solo lectura)
    tipo_documento = TipoDocumentoSerializer(
        read_only=True)

    class Meta:
        model = Registro.history.model
        fields = "__all__"

    def get_history_user_nombre(self, obj):
        # Mantiene nombre aunque el usuario haya sido eliminado
        return obj.history_user.fullname if obj.history_user else "Usuario eliminado"

    def get_history_type_display(self, obj):
        return {
            '+': 'Creación',
            '~': 'Modificación',
            '-': 'Eliminación'
        }.get(obj.history_type, obj.history_type)

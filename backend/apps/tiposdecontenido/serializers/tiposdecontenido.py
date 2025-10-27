from rest_framework import serializers

from apps.tiposdecontenido.models import TipoContenido


class TipoContenidoSerializer(serializers.ModelSerializer):
    '''
        Serializer para el modelo Tipo de Contenido
    '''
    class Meta:
        model = TipoContenido
        # * Todos los campos
        fields = "__all__"
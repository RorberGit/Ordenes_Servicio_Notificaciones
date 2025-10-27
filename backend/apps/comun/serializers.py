from rest_framework import serializers

from apps.comun.models import Estado


class EstadoSerializer(serializers.ModelSerializer):
    '''
        Serializer para el modelo Estado
    '''
    class Meta:
        model = Estado
        # * Todos los campos
        fields = "__all__"

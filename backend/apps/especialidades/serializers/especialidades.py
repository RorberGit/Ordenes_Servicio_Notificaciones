from rest_framework import serializers

from apps.especialidades.models import Especialidad


class EspecialidadSerializer(serializers.ModelSerializer):
    '''
        Serializer para el modelo Especialidad
    '''
    class Meta:
        model = Especialidad
        # * Todos los campos
        fields = "__all__"
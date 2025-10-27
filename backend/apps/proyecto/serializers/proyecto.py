from rest_framework import serializers

from apps.proyecto.models import Proyecto


class ProyectoSerializer(serializers.ModelSerializer):
    '''
        Serializer para el modelo Proyecto
    '''

    class Meta:
        model = Proyecto
        fields = "__all__"
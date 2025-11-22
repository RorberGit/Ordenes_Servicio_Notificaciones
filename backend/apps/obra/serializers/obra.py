from rest_framework import serializers

from apps.obra.models import Obra


class ObraSerializer(serializers.ModelSerializer):
    '''
        Serializer para el modelo Obra
    '''

    class Meta:
        model = Obra
        fields = "__all__"

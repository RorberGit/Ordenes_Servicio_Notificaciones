from rest_framework import serializers

from apps.ordenesdeservicio.models.ordenesservico import OrdenesServicio


class OrdenesServicioSerializar(serializers.ModelSerializer):
    '''
        Serializer para el modelo Ordenes de Servicio
    '''
    class Meta:
        model = OrdenesServicio
        # * Todos los campos
        fields = "__all__"

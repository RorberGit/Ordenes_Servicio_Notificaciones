from rest_framework import serializers

from rega.procedencia_destino.models import ProcedenciaDestino


class ProcedenciaDestinoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcedenciaDestino
        fields = "__all__"

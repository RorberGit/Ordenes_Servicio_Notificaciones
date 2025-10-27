from rest_framework import serializers
from ..models import Usuarios


class UserSerializer(serializers.ModelSerializer):
    proyecto_principal = serializers.StringRelatedField()

    class Meta:
        model = Usuarios
        fields = '__all__'

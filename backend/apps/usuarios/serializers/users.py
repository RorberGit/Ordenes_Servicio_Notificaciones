from rest_framework import serializers

from apps.obra.serializers.obra import ObraSerializer

from ..models import Usuarios


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = Usuarios
        fields = '__all__'

    def update(self, instance, validated_data):
        obras_permitidas = validated_data.pop(
            'obras_permitidas', None)

        # Campos simples
        for attr, value in validated_data.items():
            setattr(
                instance, attr, value)

        instance.save()

        # Actualizamos relación ManyToMany
        if obras_permitidas is not None:
            instance.obras_permitidas.set(
                obras_permitidas)

        return instance


class UsuarioReadSerializer(serializers.ModelSerializer):
    rol_nombre = serializers.CharField(
        source='rol.nombre', read_only=True)
    obra_principal_nombre = serializers.CharField(
        source='obra_principal.nombre', read_only=True)
    obras_permitidas = ObraSerializer(
        many=True, read_only=True)

    class Meta:
        model = Usuarios
        fields = '__all__'

    def get_obras_permitidas(self, obj):
        return [{
            'obra_nombre': obra.nombre
        } for obra in obj.obras_permitidas.all()]

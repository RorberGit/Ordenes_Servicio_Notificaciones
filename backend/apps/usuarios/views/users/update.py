from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from ...serializers.users import UserSerializer
from ...models import Usuarios
from utils.responses import ApiResponse


class UpdateUserView(APIView):
    """
    Vista para actualizar un usuario existente, incluyendo obras_permitidas (ManyToMany)
    """

    def put(self, request, pk):
        user = get_object_or_404(
            Usuarios, pk=pk)

        # Tomamos los datos enviados
        data = request.data.copy()

        # Si se envían obras_permitidas, las separamos del resto
        obras_permitidas = data.pop(
            'obras_permitidas', None)

        serializer = UserSerializer(
            user, data=data, partial=True)

        if serializer.is_valid():
            instance = serializer.save()

            # Si el cliente envía obras_permitidas, actualizamos la relación ManyToMany
            if obras_permitidas is not None:
                # DRF puede recibir lista de IDs en string o int
                if isinstance(obras_permitidas, str):
                    # por si llega como '["1","2","3"]'
                    import json
                    obras_permitidas = json.loads(
                        obras_permitidas)

                instance.obras_permitidas.set(
                    obras_permitidas)

            return Response(
                ApiResponse(
                    success=True,
                    message="Usuario actualizado exitosamente",
                    data=UserSerializer(
                        instance).data
                ).to_dict(),
                status=status.HTTP_200_OK
            )

        return Response(
            ApiResponse(
                success=False,
                message="Datos inválidos",
                data=serializer.errors
            ).to_dict(),
            status=status.HTTP_400_BAD_REQUEST
        )

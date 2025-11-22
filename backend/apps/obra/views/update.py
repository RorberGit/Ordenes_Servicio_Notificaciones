from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework import status, permissions


from django.shortcuts import get_object_or_404

from apps.obra.models import Obra
from apps.obra.serializers.obra import ObraSerializer

from apps.ordenesdeservicio.utils import Parametros


class ObraUpdateView(APIView):
    '''
        Vista para la actualización de los datos de los Obras
        Param:
            id del obra
    '''
    permission_classes = [
        permissions.IsAuthenticated]

    def put(self, request):

        # * Obtener objeto de la logica get_object
        instance = get_object_or_404(
            Obra, Parametros(request))

        # * Serializer parcial de los datos
        serializer = ObraSerializer(
            instance, data=request.data, partial=True)

        if serializer.is_valid():  # * Si son valores validos
            # * Registrar los cambios
            serializer.save()

            # * En caso de exicto
            return Response(
                serializer.data, status=status.HTTP_200_OK)

        # * En caso de error emitir un 400
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)

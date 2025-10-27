from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework import status


from django.shortcuts import get_object_or_404

from apps.proyecto.models import Proyecto
from apps.proyecto.serializers.proyecto import ProyectoSerializer

from apps.ordenesdeservicio.utils import Parametros


class ProyectoUpdateView(APIView):
    '''
        Vista para la actualización de los datos de los Proyectos
        Param:
            id del proyecto
    '''

    def put(self, request):

        # * Obtener objeto de la logica get_object
        instance = get_object_or_404(
            Proyecto, Parametros(request))

        # * Serializer parcial de los datos
        serializer = ProyectoSerializer(
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
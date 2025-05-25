from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework import status


from django.shortcuts import get_object_or_404

from apps.ordenesdeservicio.models.ordenesservico import OrdenesServicio
from apps.ordenesdeservicio.serializers.ordenesservicio import OrdenesServicioSerializar

from apps.ordenesdeservicio.utils import Parametros


class OrdenesServicioUpdateView(APIView):
    '''
        Vista para la actualización de los datos de las Ordenes de Servicio
        Param:
            numero de orden
    '''

    def put(self, request):

        # * Obctener objecto de la logica get_object
        instance = get_object_or_404(
            OrdenesServicio, Parametros(request))

        # * Serializer parcial de los datos
        serializer = OrdenesServicioSerializar(
            instance, data=request.data, partial=True)

        if serializer.is_valid():  # * Si son valores validos
            # * Registrar los cambios
            serializer.save()

            # * En caso de exicto
            return Response(
                request.data, status=status.HTTP_200_OK)

        # * En caso de error emitir un 400
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)

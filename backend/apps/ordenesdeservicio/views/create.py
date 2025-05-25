from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework import permissions, status

from apps.ordenesdeservicio.serializers.ordenesservicio import OrdenesServicioSerializar


class OrdenesServicioCreateView(APIView):
    '''
        Vista para insertar nuevas Ordenes de Servicio
    '''

    permission_classes = [
        permissions.AllowAny]

    def post(self, request):

        # * Serializador del modelo
        serializer = OrdenesServicioSerializar(
            data=request.data)

        # * Si los datos son validos
        if serializer.is_valid(raise_exception=True):
            # * Almacena los datos suministrados
            serializer.save()
            # * Retornar un 201 con los nuevos datos creados
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # * Si se a producido un error emitir un mensaje con un 400
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

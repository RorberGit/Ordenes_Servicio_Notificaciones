from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, exceptions

from apps.ordenesdeservicio.models.ordenesservico import OrdenesServicio
from apps.ordenesdeservicio.serializers.ordenesservicio import OrdenesServicioSerializar

from apps.ordenesdeservicio.utils import Parametros


class OrdenesServicioGetOneView(APIView):
    '''
        Vista de consulta de un solo registro
    '''

    def get(self, request):

        # * Obtener filtro
        filtro = Parametros(
            request)

        # * Si no existe un filtro
        if not filtro:
            raise exceptions.ValidationError(
                "Sin filtros para la consulta", status.HTTP_400_BAD_REQUEST)

        try:
            # * Octener el objecto ordenes de servicio
            ordenservicio = OrdenesServicio.objects.get(
                Parametros(request))
        except OrdenesServicio.DoesNotExist:
            # * En caso de no tener resultado
            raise exceptions.NotFound(
                "No se encontro el registro", status.HTTP_404_NOT_FOUND)

        # * Serializar el objecto
        serializer = OrdenesServicioSerializar(
            ordenservicio)

        # * Mostrar los resultados
        return Response(serializer.data, status=status.HTTP_200_OK)

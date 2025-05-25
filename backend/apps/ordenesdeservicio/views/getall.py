from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.ordenesdeservicio.models.ordenesservico import OrdenesServicio
from apps.ordenesdeservicio.serializers.ordenesservicio import OrdenesServicioSerializar
from apps.ordenesdeservicio.utils import Parametros


class OrdenesServicioGetAllView(APIView):
    '''
        Vista de consulta de un solo registro
    '''

    def get(self, request):
        # * Octener el objecto ordenes de servicio
        ordenservicio = OrdenesServicio.objects.filter(
            Parametros(request))
        
        # * Serializar el objecto
        serializer = OrdenesServicioSerializar(
            ordenservicio, many=True)
        
        # * Mostrar los resultados
        return Response(serializer.data, status=status.HTTP_200_OK)

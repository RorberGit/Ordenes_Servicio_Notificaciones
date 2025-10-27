from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ...serializers.users import UserSerializer
from ...models import Usuarios
from utils.responses import ApiResponse


class GetAllUserView(APIView):
    def get(self, request):
        users = Usuarios.objects.all()
        proyecto = request.query_params.get(
            'proyecto')
        proyecto_id = request.query_params.get(
            'proyecto_id')

        # Filtrar por nombre del proyecto si se proporciona
        if proyecto:
            users = users.filter(
                proyecto__nombre__icontains=proyecto)

        # Filtrar por ID del proyecto si se proporciona
        if proyecto_id:
            users = users.filter(
                proyecto__id=proyecto_id)

        serializer = UserSerializer(
            users, many=True)
        api_response = ApiResponse(
            success=True,
            message="Usuarios obtenidos exitosamente.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )
        return Response(api_response.to_dict(), status=api_response.status_code)

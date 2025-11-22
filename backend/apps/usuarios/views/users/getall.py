from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from ...serializers.users import UsuarioReadSerializer
from ...models import Usuarios
from utils.responses import ApiResponse


class GetAllUserView(APIView):
    permission_classes = [
        permissions.IsAuthenticated]

    def get(self, request):
        users = Usuarios.objects.all()
        obra = request.query_params.get(
            'obra')
        obra_id = request.query_params.get(
            'obra_id')

        # Filtrar por nombre del obra si se proporciona
        if obra:
            users = users.filter(
                obra__nombre__icontains=obra)

        # Filtrar por ID del obra si se proporciona
        if obra_id:
            users = users.filter(
                obra__id=obra_id)

        serializer = UsuarioReadSerializer(
            users, many=True)
        api_response = ApiResponse(
            success=True,
            message="Usuarios obtenidos exitosamente.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )
        return Response(api_response.to_dict(), status=api_response.status_code)

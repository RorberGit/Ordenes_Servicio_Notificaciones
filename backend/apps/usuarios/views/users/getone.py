from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from ...serializers.users import UsuarioReadSerializer
from ...models import Usuarios
from django.shortcuts import get_object_or_404
from utils.responses import ApiResponse


class GetOneUserView(APIView):
    permission_classes = [
        permissions.IsAuthenticated]

    def get(self, request):
        lookup_filters = {}

        # Buscar por parámetros
        user_id = request.query_params.get(
            'id')
        username = request.query_params.get(
            'username')
        fullname = request.query_params.get(
            'fullname')

        if user_id:
            lookup_filters['pk'] = user_id
        elif username:
            lookup_filters['username'] = username
        elif fullname:
            lookup_filters['fullname'] = fullname
        else:
            api_response = ApiResponse(
                success=False,
                message="Debe proporcionar id, username o fullname",
                status_code=status.HTTP_400_BAD_REQUEST
            )
            return Response(api_response.to_dict(), status=api_response.status_code)

        # Buscar el usuario usando los filtros. get_object_or_404 maneja el 404
        try:
            user = get_object_or_404(
                Usuarios, **lookup_filters)
        except Exception as e:
            # Esto captura cualquier error potencial en la búsqueda (ej: QuerySet)
            api_response = ApiResponse(
                success=False,
                message="Error al obtener el usuario.",
                data=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            return Response(api_response.to_dict(), status=api_response.status_code)

        # Serialización y Respuesta Exitosa
        serializer = UsuarioReadSerializer(
            user)
        api_response = ApiResponse(
            success=True,
            message="Usuario obtenido exitosamente.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )
        return Response(api_response.to_dict(), status=api_response.status_code)

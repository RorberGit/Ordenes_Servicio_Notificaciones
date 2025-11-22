from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.core.paginator import Paginator
from apps.usuarios.models import Usuarios
from apps.usuarios.serializers.users import UsuarioReadSerializer


class PendingUsersView(APIView):
    """
    Lista los usuarios pendientes de activación (active=False).
    Solo accesible a administradores.
    """
    permission_classes = [
        permissions.IsAuthenticated]

    def get(self, request):
        usuarios_qs = Usuarios.objects.filter(
            active=False).order_by('username')

        page_number = request.query_params.get(
            'page', 1)
        page_size = int(
            request.query_params.get('page_size', 10))
        paginator = Paginator(
            usuarios_qs, page_size)
        page = paginator.get_page(
            page_number)

        serializer = UsuarioReadSerializer(
            page.object_list, many=True)

        return Response({
            "count": paginator.count,
            "total_pages": paginator.num_pages,
            "current_page": page.number,
            "results": serializer.data
        }, status=status.HTTP_200_OK)

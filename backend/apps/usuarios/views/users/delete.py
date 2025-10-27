from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ...models import Usuarios
from django.shortcuts import get_object_or_404


class DeleteUserView(APIView):
    def delete(self, request, pk):
        user = get_object_or_404(
            Usuarios, pk=pk)
        user.delete()
        return Response({"message": "Usuario eliminado"}, status=status.HTTP_204_NO_CONTENT)

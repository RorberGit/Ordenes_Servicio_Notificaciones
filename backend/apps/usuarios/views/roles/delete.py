from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ...models import Rol
from django.shortcuts import get_object_or_404


class DeleteRolView(APIView):
    def delete(self, request, pk):
        rol = get_object_or_404(Rol, pk=pk)
        rol.delete()
        return Response({"message": "Rol eliminado"}, status=status.HTTP_204_NO_CONTENT)
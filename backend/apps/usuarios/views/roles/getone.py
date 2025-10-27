from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ...serializers.roles import RolSerializer
from ...models import Rol
from django.shortcuts import get_object_or_404


class GetOneRolView(APIView):
    def get(self, request, pk):
        rol = get_object_or_404(Rol, pk=pk)
        serializer = RolSerializer(rol)
        return Response(serializer.data, status=status.HTTP_200_OK)
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ...serializers.roles import RolSerializer
from ...models import Rol
from django.shortcuts import get_object_or_404


class UpdateRolView(APIView):
    def put(self, request, pk):
        rol = get_object_or_404(Rol, pk=pk)
        serializer = RolSerializer(rol, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
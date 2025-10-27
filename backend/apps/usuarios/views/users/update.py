from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ...serializers.users import UserSerializer
from ...models import Usuarios
from django.shortcuts import get_object_or_404


class UpdateUserView(APIView):
    def put(self, request, pk):
        user = get_object_or_404(
            Usuarios, pk=pk)
        serializer = UserSerializer(
            user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

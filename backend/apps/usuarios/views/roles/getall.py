from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ...serializers.roles import RolSerializer
from ...models import Rol


class GetAllRolView(APIView):
    def get(self, request):
        roles = Rol.objects.all()
        serializer = RolSerializer(roles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
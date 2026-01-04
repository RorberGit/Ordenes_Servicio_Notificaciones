from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ...serializers.users import UserSerializer
from utils.responses import ApiResponse


class CreateUserView(APIView):
    def post(self, request):
        serializer = UserSerializer(
            data=request.data)
        if serializer.is_valid():
            serializer.save()
            api_response = ApiResponse(
                success=True,
                message="Usuario creado exitosamente.",
                data=serializer.data,
                status_code=status.HTTP_201_CREATED
            )
            return Response(api_response.to_dict(), status=api_response.status_code)
        api_response = ApiResponse(
            success=False,
            message="Datos inválidos para crear el usuario.",
            data=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )
        return Response(api_response.to_dict(), status=api_response.status_code)

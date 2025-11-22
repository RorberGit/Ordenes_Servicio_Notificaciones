from rest_framework import generics, permissions, status
from rest_framework.response import Response

from apps.obra.models import Obra
from utils.responses import ApiResponse


class ObraDeleteView(generics.GenericAPIView):
    """
    Vista genérica para eliminar un Tipo de Contenido por ID o por nombre.
    """
    queryset = Obra.objects.all()
    # Ajusta según tus permisos
    permission_classes = [
        permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        id_param = request.query_params.get(
            'id', None)
        nombre_param = request.query_params.get(
            'nombre', None)

        if not id_param and not nombre_param:
            return Response(
                ApiResponse(
                    success=False,
                    message="Debe proporcionar 'id' o 'nombre' de la Obra").to_dict(),
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if id_param:
                obra = self.get_queryset(
                ).get(id=id_param)
            else:
                obra = self.get_queryset(
                ).get(nombre=nombre_param)
        except Obra.DoesNotExist:
            return Response(
                ApiResponse(
                    success=False,
                    message="Obra no encontrada"
                ).to_dict(),
                status=status.HTTP_404_NOT_FOUND
            )

        obra.delete()

        return Response(
            ApiResponse(
                success=True,
                message=f"Obra '{obra.nombre}' eliminada correctamente").to_dict(),
            status=status.HTTP_200_OK)

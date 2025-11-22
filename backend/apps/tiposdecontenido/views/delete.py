from rest_framework import generics, permissions, status
from rest_framework.response import Response

from apps.tiposdecontenido.models import TipoContenido
from utils.responses import ApiResponse


class TipoContenidodDeleteView(generics.GenericAPIView):
    """
    Vista genérica para eliminar un Tipo de Contenido por ID o por nombre.
    """
    queryset = TipoContenido.objects.all()
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
                    message="Debe proporcionar 'id' o 'nombre' del Tipo de Contenido").to_dict(),
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if id_param:
                tipocontenido = self.get_queryset(
                ).get(id=id_param)
            else:
                tipocontenido = self.get_queryset(
                ).get(nombre=nombre_param)
        except TipoContenido.DoesNotExist:
            return Response(
                ApiResponse(
                    success=False,
                    message="Tipo de Contenido no encontrado"
                ).to_dict(),
                status=status.HTTP_404_NOT_FOUND
            )

        tipocontenido.delete()

        return Response(
            ApiResponse(
                success=True,
                message=f"Tipo de Contenido '{tipocontenido.nombre}' eliminado correctamente").to_dict(),
            status=status.HTTP_200_OK)

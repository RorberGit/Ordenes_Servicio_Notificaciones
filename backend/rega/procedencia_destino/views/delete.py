from rest_framework import generics, permissions, status
from rest_framework.response import Response

from rega.procedencia_destino.models import ProcedenciaDestino
from utils.responses import ApiResponse


class ProcedenciaDestinoDeleteView(generics.GenericAPIView):
    """
    Vista genérica para eliminar por ID o por nombre.
    """
    queryset = ProcedenciaDestino.objects.all()
    # Ajusta según tus permisos
    permission_classes = [
        permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        id_param = request.query_params.get(
            'id', None)

        if not id_param:
            return Response(
                ApiResponse(
                    success=False,
                    message="Debe proporcionar un 'id'").to_dict(),
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if id_param:
                response = self.get_queryset(
                ).get(id=id_param)
        except ProcedenciaDestino.DoesNotExist:
            return Response(
                ApiResponse(
                    success=False,
                    message="Registro no encontrado"
                ).to_dict(),
                status=status.HTTP_404_NOT_FOUND
            )

        response.delete()

        return Response(
            ApiResponse(
                success=True,
                message=f"Procedencia o Destino '{response.descripcion}' eliminado correctamente").to_dict(),
            status=status.HTTP_200_OK)

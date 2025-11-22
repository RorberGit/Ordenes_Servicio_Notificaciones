from rest_framework import generics, permissions, status
from rest_framework.response import Response

from apps.especialidades.models import Especialidad
from utils.responses import ApiResponse


class EspecialidadDeleteView(generics.GenericAPIView):
    """
    Vista genérica para eliminar una Especialidad por ID o por nombre.
    """
    queryset = Especialidad.objects.all()
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
                    message="Debe proporcionar 'id' o 'nombre' de la especialidad").to_dict(),
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if id_param:
                especialidad = self.get_queryset(
                ).get(id=id_param)
            else:
                especialidad = self.get_queryset(
                ).get(nombre=nombre_param)
        except Especialidad.DoesNotExist:
            return Response(
                ApiResponse(
                    success=False,
                    message="Especialidad no enconrada"
                ).to_dict(),
                status=status.HTTP_404_NOT_FOUND
            )

        especialidad.delete()

        return Response(
            ApiResponse(
                success=True,
                message=f"Especialidad '{especialidad.nombre}' eliminada correctamente").to_dict(),
            status=status.HTTP_200_OK)

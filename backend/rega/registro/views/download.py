from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404

from rega.registro.models import Registro


def DescargarArchivo(request, pk):
    documento = get_object_or_404(
        Registro, pk=pk)

    if not documento.archivo:
        raise Http404(
            "Archivo no encontrado")

    # Retorna respuesta con el archivo adjunto
    response = FileResponse(
        documento.archivo.open('rb'), as_attachment=True)
    response[
        'Content-Disposition'] = f'attachment; filename="{documento.archivo.name.split("/")[-1]}"'
    return response

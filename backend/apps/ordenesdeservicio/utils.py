from django.db.models import Q


def Parametros(request):
    filtros = Q()

    # * Obtener parámetros desde la URL
    numero_orden = request.query_params.get(
        'numero_orden', None)

    # * Buscar por numero_orden si está presente
    if numero_orden is not None:
        filtros &= Q(
            numero_orden=numero_orden)

    # * Retornar el filtro
    return filtros

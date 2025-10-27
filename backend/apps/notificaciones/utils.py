from django.db.models import Q


def Parametros(request):
    filtros = Q()

    # * Obtener parámetros desde la URL
    numero_notificacion = request.query_params.get(
        'numero_notificacion', None)
    id = request.query_params.get(
        'id', None)

    # * Buscar por numero_notificacion si está presente
    if numero_notificacion is not None:
        filtros &= Q(
            numero_notificacion=numero_notificacion)

    # * Buscar por id si está presente
    if id is not None:
        filtros &= Q(
            id=id)

    # * Retornar el filtro
    return filtros

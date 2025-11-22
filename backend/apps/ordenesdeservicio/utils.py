from django.db.models import Q


def Parametros(request):
    filtros = Q()

    # * Obtener parámetros desde la URL
    numero_orden = request.query_params.get(
        'numero_orden', None)

    id_param = request.query_params.get(
        'id', None)

    nombre_qr = request.query_params.get(
        'nombre', None)

    # * Buscar por numero_orden si está presente
    if numero_orden is not None:
        filtros &= Q(
            numero_orden=numero_orden)

    # * Buscar por id si está presente
    if id_param is not None:
        filtros &= Q(
            id=id_param)

    # * Buscar por nombre si está presente
    if nombre_qr is not None:
        filtros &= Q(
            nombre=nombre_qr)

    # * Retornar el filtro
    return filtros

from django.db.models import Q
from django.utils import timezone
from datetime import timedelta


def Filters(request):
    query = Q()

    # Recuperar estado
    estado = request.query_params.get(
        'estado', None)

    # Si estado existe
    if estado is not None:
        if (estado == 'vencidas') or (estado == 'proximas'):
            # Fecha actual
            hoy = timezone.localtime(
                timezone.now()).date()
            # Pasado 10 dias
            fecha_limite = hoy - \
                timedelta(
                    days=10)

            # Si están en progreso
            query &= Q(
                estado_id__exact=2)

            if estado == 'vencidas':
                # Órdenes con fecha_notificacion pasada de 10 días (más de 10 días)
                query &= Q(
                    fecha_notificacion__lt=fecha_limite, fecha_notificacion__isnull=False)

            if estado == 'proximas':
                # Órdenes próximas a vencerse: 3 días antes de los 10 días (entre 7 y 10 días atrás)
                fecha_fin = hoy - \
                    timedelta(
                        days=7)
                query = Q(
                    fecha_notificacion__range=(
                        fecha_limite, fecha_fin),
                    fecha_notificacion__isnull=False
                )
        else:
            query &= Q(
                estado_id__exact=estado)

    return query

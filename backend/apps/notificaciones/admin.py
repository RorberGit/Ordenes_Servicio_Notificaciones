from django.contrib import admin

from apps.notificaciones.models.notificaciones import HistoricoNotificacion, Notificacion

# Register your models here.
admin.site.register(
    [Notificacion, HistoricoNotificacion])

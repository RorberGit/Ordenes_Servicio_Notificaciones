from django.contrib import admin

from apps.notificaciones.models.notificaciones import Notificaciones

# Register your models here.
admin.site.register(
    [Notificaciones])

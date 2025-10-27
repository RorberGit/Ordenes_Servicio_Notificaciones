from django.contrib import admin

from apps.ordenesdeservicio.models.ordenesservico import HistoricoOS, OrdenesServicio


# Register your models here.
admin.site.register(
    [OrdenesServicio, HistoricoOS])

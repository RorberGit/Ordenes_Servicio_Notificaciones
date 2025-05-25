from django.contrib import admin

from apps.ordenesdeservicio.models.ordenesservico import OrdenesServicio


# Register your models here.
admin.site.register(
    [OrdenesServicio])

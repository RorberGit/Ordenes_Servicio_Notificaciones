from django.contrib import admin

from apps.tiposderespuesta.models import TipoDeRespuesta

admin.site.site_header = "Sistema de Gestión de Obras"
admin.site.site_title = "Administración de Obras"
admin.site.index_title = "Bienvenido al Sistema de Gestión de Obras"
# Aquí puedes registrar tus modelos personalizados
admin.site.register(
    TipoDeRespuesta)

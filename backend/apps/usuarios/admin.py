from django.contrib import admin

from apps.usuarios.models import Rol, Usuarios

admin.site.register([
    Usuarios, Rol
])

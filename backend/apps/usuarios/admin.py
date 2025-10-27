from django.contrib import admin

from apps.usuarios.models import Rol, Usuarios, Permisos

admin.site.register([
    Usuarios, Rol, Permisos
])

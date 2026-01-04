"""
URL configuration for api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path(
        'admin/', admin.site.urls),
    path("ordenes/",
         include("apps.ordenesdeservicio.urls")),
    path("tipos-contenido/",
         include("apps.tiposdecontenido.urls")),
    path("especialidades/",
         include("apps.especialidades.urls")),
    path("notificaciones/",
         include("apps.notificaciones.urls")),
    path("obras/",
         include("apps.obra.urls")),
    path("usuarios/",
         include("apps.usuarios.urls")),
    path(
        "auth/", include("apps.administrar.urls")),
    path("registros/",
         include("rega.registro.urls")),
    path("procedencia-destino/",
         include("rega.procedencia_destino.urls")),
    path("tipo-documento/",
         include("rega.tipo_documento.urls")),
    path("unidad/",
         include("rega.unidad.urls"))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

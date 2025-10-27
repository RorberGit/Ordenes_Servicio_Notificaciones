from django.urls import path

from apps.tiposdecontenido.views.getall_optimized import TipoContenidoGetAllView

urlpatterns = [
    path("getall/",
         TipoContenidoGetAllView.as_view(), name="Obtener todos los tipos de contenido"),
]

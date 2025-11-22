from django.urls import path

from apps.tiposdecontenido.views import (TipoContenidoCreateView, TipoContenidodDeleteView,
                                         TipoContenidoGetOneView, TipoContenidoGetAllPaginatedView,
                                         TipoContenidoUpdateView, TiposContenidoGetAllView)


urlpatterns = [
    path("getone",
         TipoContenidoGetOneView.as_view(), name="Obtener un tipo de contenido"),
    path("getall/",
         TiposContenidoGetAllView.as_view(), name="Obtener todos los tipos de contenido"),
    path("getall-paginated/",
         TipoContenidoGetAllPaginatedView.as_view(), name="Obtener todos los tipos de contenido paginados"),
    path("create/",
         TipoContenidoCreateView.as_view(), name="Crear un tipo de contenido"),
    path("update",
         TipoContenidoUpdateView.as_view(), name="Actualizar un tipo de contenido"),
    path("delete",
         TipoContenidodDeleteView.as_view(), name="Eliminar un tipo de contenido"),
]

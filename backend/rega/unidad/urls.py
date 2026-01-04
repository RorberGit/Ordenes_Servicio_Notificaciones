from django.urls import path
from rega.unidad.views.create import UnidadCreateView
from rega.unidad.views.delete import UnidadDeleteView
from rega.unidad.views.getall import UnidadGetAllView
from rega.unidad.views.getall_paginated import UnidadGetAllPaginatedView
from rega.unidad.views.getone import UnidadGetOneView
from rega.unidad.views.update import UnidadUpdateView

urlpatterns = [
    path("getone",
         UnidadGetOneView.as_view(), name="getone"),
    path("getall/",
         UnidadGetAllView.as_view(), name="getall"),
    path("getall-paginated/",
         UnidadGetAllPaginatedView.as_view(), name="getall-paginated"),
    path("create/",
         UnidadCreateView.as_view(), name="create"),
    path("update",
         UnidadUpdateView.as_view(), name="update"),
    path("delete",
         UnidadDeleteView.as_view(), name="dalete"),
]

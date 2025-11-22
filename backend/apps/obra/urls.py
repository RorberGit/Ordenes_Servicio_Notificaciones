from django.urls import path

from apps.obra.views.create import ObraCreateView
from apps.obra.views.delete import ObraDeleteView
from apps.obra.views.update import ObraUpdateView
from apps.obra.views.getone import ObraGetOneView
from apps.obra.views.getall import ObraGetAllView
from apps.obra.views.getall_paginated import ObraGetAllPaginatedView

urlpatterns = [
    path("create/",
         ObraCreateView.as_view(), name="Nuevo registro"),
    path("update",
         ObraUpdateView.as_view(), name="Actualizar registro"),
    path("getone",
         ObraGetOneView.as_view(), name="Obtener un registro"),
    path("getall/",
         ObraGetAllView.as_view(), name="Obtener todos los registros"),
    path("getall-paginated/", ObraGetAllPaginatedView.as_view(),
         name="Todo con paginación"),
    path("delete", ObraDeleteView.as_view(),
         name="Todo con paginación")

]

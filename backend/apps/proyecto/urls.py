from django.urls import path

from apps.proyecto.views.create import ProyectoCreateView
from apps.proyecto.views.update import ProyectoUpdateView
from apps.proyecto.views.getone import ProyectoGetOneView
from apps.proyecto.views.getall import ProyectoGetAllView
from apps.proyecto.views.getall_paginated import ProyectoGetAllPaginatedView

urlpatterns = [
    path("create/",
         ProyectoCreateView.as_view(), name="Nuevo registro"),
    path("update",
         ProyectoUpdateView.as_view(), name="Actualizar registro"),
    path("getone",
         ProyectoGetOneView.as_view(), name="Obtener un registro"),
    path("getall/",
         ProyectoGetAllView.as_view(), name="Obtener todos los registros"),
    path("getall-paginated/", ProyectoGetAllPaginatedView.as_view(),
         name="Todo con paginación")

]
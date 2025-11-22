from django.urls import path

from apps.especialidades.views.create import EspecialidadCreateView
from apps.especialidades.views.delete import EspecialidadDeleteView
from apps.especialidades.views.getall import EspecialidadGetAllView
from apps.especialidades.views.getall_paginated import EspecialidadesGetAllPaginatedView
from apps.especialidades.views.getone import EspecialidadGetOneFilteredView
from apps.especialidades.views.update import EspecialidadUpdateView

urlpatterns = [
    path("getall/",
         EspecialidadGetAllView.as_view(), name="Obtener todas las especialidades"),
    path("getall-paginated/", EspecialidadesGetAllPaginatedView.as_view(),
         name="Todo con paginación"),
    path('getone', EspecialidadGetOneFilteredView.as_view(),
         name='especialidad-get-one'),
    path('create/', EspecialidadCreateView.as_view(),
         name='crear_especialidad'),
    path('update', EspecialidadUpdateView.as_view(),
         name='update_especialidad'),
    path('delete', EspecialidadDeleteView.as_view(),
         name='delete_especialidad'),
]

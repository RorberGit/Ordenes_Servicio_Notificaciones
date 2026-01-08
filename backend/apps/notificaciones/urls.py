from django.urls import path

from apps.notificaciones.views.getall import NotificacionGetAllView
from apps.notificaciones.views.getall_paginated import NotificacionGetAllPaginatedView
from apps.notificaciones.views.getone import NotificacionGetOneView
from apps.notificaciones.views.create import NotificacionCreateView
from apps.notificaciones.views.update import NotificacionUpdateView

urlpatterns = [
    path("getall/",
         NotificacionGetAllView.as_view(), name="Obtener todas las notificaciones"),
    path("getall-paginated",
         NotificacionGetAllPaginatedView.as_view(), name="Obtener todas las notificaciones paginadas"),
    path("getone/",
         NotificacionGetOneView.as_view(), name="Obtener una notificación"),
    path("create/",
         NotificacionCreateView.as_view(), name="Crear notificación"),
    path("update",
         NotificacionUpdateView.as_view(), name="Actualizar notificación"),
]

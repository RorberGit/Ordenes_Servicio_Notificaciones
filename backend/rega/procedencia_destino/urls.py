from django.urls import path
from rega.procedencia_destino.views.create import ProcedenciaDestinoCreateView
from rega.procedencia_destino.views.delete import ProcedenciaDestinoDeleteView
from rega.procedencia_destino.views.getall import ProcedenciaDestinoGetAllView
from rega.procedencia_destino.views.getall_paginated import ProcedenciaDestinoGetAllPaginatedView
from rega.procedencia_destino.views.getone import ProcedenciaDestinoGetOneView
from rega.procedencia_destino.views.update import ProcedenciaDestinoUpdateView

urlpatterns = [
    path("getone",
         ProcedenciaDestinoGetOneView.as_view(), name="getone"),
    path("getall/",
         ProcedenciaDestinoGetAllView.as_view(), name="getall"),
    path("getall-paginated/",
         ProcedenciaDestinoGetAllPaginatedView.as_view(), name="getall-paginated"),
    path("create/",
         ProcedenciaDestinoCreateView.as_view(), name="create"),
    path("update",
         ProcedenciaDestinoUpdateView.as_view(), name="update"),
    path("delete",
         ProcedenciaDestinoDeleteView.as_view(), name="dalete"),
]

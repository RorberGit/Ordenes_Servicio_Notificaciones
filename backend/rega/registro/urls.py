# urls.py
from django.urls import path
from rega.registro.views.create import RegistroListCreateAPIView
from rega.registro.views.download import DescargarArchivo
from rega.registro.views.getall import RegistroGetAllView
from rega.registro.views.getall_paginated import RegistroGetAllPaginatedView
from rega.registro.views.getone import RegistroDetailWithHistoryAPIView
from rega.registro.views.update import RegistroUpdateView

urlpatterns = [
    path('create/', RegistroListCreateAPIView.as_view(),
         name='registros-list-create'),
    path('getall/', RegistroGetAllView.as_view(), name='registros-getall'),
    path('getall-paginated', RegistroGetAllPaginatedView.as_view(), name='registros-getall-paginated'),
    path('update/<str:pk>/', RegistroUpdateView.as_view(), name='registro-update'),
    path('getone',
         RegistroDetailWithHistoryAPIView.as_view(), name='registro-detail-history'),
    path('download/<str:pk>/', DescargarArchivo, name='descargar_documento'),
]

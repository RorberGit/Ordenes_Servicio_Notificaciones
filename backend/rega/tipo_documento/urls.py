from django.urls import path
from rega.tipo_documento.views.create import TipoDocumentoCreateView
from rega.tipo_documento.views.delete import TipoDocumentoDeleteView
from rega.tipo_documento.views.getall import TipoDocumentoGetAllView
from rega.tipo_documento.views.getall_paginated import TipoDocumentoGetAllPaginatedView
from rega.tipo_documento.views.getone import TipoDocumentoGetOneView
from rega.tipo_documento.views.update import TipoDocumentoUpdateView

urlpatterns = [
    path("getone",
         TipoDocumentoGetOneView.as_view(), name="getone"),
    path("getall/",
         TipoDocumentoGetAllView.as_view(), name="getall"),
    path("getall-paginated/",
         TipoDocumentoGetAllPaginatedView.as_view(), name="getall-paginated"),
    path("create/",
         TipoDocumentoCreateView.as_view(), name="create"),
    path("update",
         TipoDocumentoUpdateView.as_view(), name="update"),
    path("delete",
         TipoDocumentoDeleteView.as_view(), name="dalete"),
]

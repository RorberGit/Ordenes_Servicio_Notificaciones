from django.urls import path

from apps.ordenesdeservicio.views.create import OrdenesServicioCreateView
from apps.ordenesdeservicio.views.update import OrdenesServicioUpdateView
from apps.ordenesdeservicio.views.getone import OrdenesServicioGetOneView
from apps.ordenesdeservicio.views.getall import OrdenesServicioGetAllView

urlpatterns = [
    path("create/",
         OrdenesServicioCreateView.as_view(), name="Nuevo registro"),
    path("update",
         OrdenesServicioUpdateView.as_view(), name="Actualizar registro"),
    path("getone",
         OrdenesServicioGetOneView.as_view(), name="Obtener un registro"),
    path("getall",
         OrdenesServicioGetAllView.as_view(), name="Obtener todos los registros"),

]

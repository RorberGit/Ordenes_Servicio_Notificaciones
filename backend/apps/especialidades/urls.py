from django.urls import path

from apps.especialidades.views.getall import EspecialidadGetAllView

urlpatterns = [
    path("getall/",
         EspecialidadGetAllView.as_view(), name="Obtener todas las especialidades"),
]

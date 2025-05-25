from django.db import models

from template.models import FieldsTemplate

# Create your models here.


class Notificaciones(FieldsTemplate):
    numero_notificacion = models.CharField(
        verbose_name="Número de Notificación", max_length=20, unique=True)
    descripcion = models.TextField(
        verbose_name="Descripción")
    fecha_recepcion = models.DateTimeField(
        verbose_name="Fecha de recepción", auto_now_add=True)

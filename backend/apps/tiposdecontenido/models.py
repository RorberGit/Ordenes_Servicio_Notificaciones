from django.db import models

from template.models import FieldsTemplate


class TipoContenido(FieldsTemplate):
    nombre = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Nombre del Tipo de Contenido",
        help_text="Nombre identificativo del tipo de contenido"
    )
    descripcion = models.TextField(
        blank=True,
        verbose_name="Descripción",
        help_text="Descripción opcional del tipo de contenido"
    )

    class Meta:
        verbose_name = "Tipo de Contenido"
        verbose_name_plural = "Tipos de Contenido"

    def __str__(self):
        return self.nombre

from django.db import models

from template.models import FieldsTemplate


class TipoDeRespuesta(FieldsTemplate):
    """
    Modelo para representar un tipo de respuesta.
    """
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Nombre",
        help_text="Nombre del tipo de respuesta"
    )

    description = models.TextField(
        blank=True,
        null=True,
        verbose_name="Descripción",
        help_text="Descripción del tipo de respuesta"
    )

    class Meta:
        verbose_name = "Tipo de Respuesta"
        verbose_name_plural = "Tipos de Respuesta"
        ordering = [
            "-created_at"]

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return f"/tiposderespuesta/{self.id}/"

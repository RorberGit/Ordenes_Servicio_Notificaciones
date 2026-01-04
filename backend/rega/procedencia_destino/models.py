from django.db import models

from template.models import FieldsTemplate


class ProcedenciaDestino(FieldsTemplate):
    cod = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Código",
        help_text="Código"
    )
    descripcion = models.TextField(
        unique=True,
        blank=True,
        verbose_name="Descripción",
        help_text="Descripción opcional"
    )

    class Meta:
        verbose_name = "Procedencia o Destino"
        verbose_name_plural = "Procedencias o Destinos"

    def __str__(self):
        return f"{self.cod} - {self.descripcion}"

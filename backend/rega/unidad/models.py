from django.db import models

from template.models import FieldsTemplate


class Unidad(FieldsTemplate):
    cod = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Código",
        help_text="Código"
    )
    descripcion = models.TextField(
        blank=True,
        unique=True,
        verbose_name="Descripción",
        help_text="Descripción opcional"
    )

    class Meta:
        verbose_name = "Unidad"
        verbose_name_plural = "Unidades"

    def __str__(self):
        return f"{self.cod} - {self.descripcion}"

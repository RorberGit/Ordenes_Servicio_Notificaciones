from django.db import models

from template.models import FieldsTemplate


class Especialidad(FieldsTemplate):
    """Modelo de Especialidad
    Este modelo representa una especialidad que puede ser asignada a una orden de servicio.
        Cada especialidad tiene un nombre único y una descripción opcional.
    """
    nombre = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Nombre de la Especialidad",
        help_text="Nombre único de la especialidad"
    )

    descripcion = models.TextField(
        blank=True,
        verbose_name="Descripción",
        help_text="Descripción detallada de la especialidad"
    )

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Especialidad"
        verbose_name_plural = "Especialidades"
        ordering = ['nombre']

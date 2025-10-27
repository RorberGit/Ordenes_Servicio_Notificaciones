from django.db import models

from template.models import FieldsTemplate


class Proyecto(FieldsTemplate):
    """Modelo de Proyecto
    Este modelo representa los proyectos que pueden tener múltiples órdenes de servicio y notificaciones.
    """
    # Nombre del proyecto
    nombre = models.CharField(
        max_length=255,
        unique=True,
        verbose_name="Nombre del Proyecto",
        help_text="Nombre único del proyecto"
    )

    # Descripción del proyecto
    descripcion = models.TextField(
        blank=True,
        null=True,
        verbose_name="Descripción",
        help_text="Descripción detallada del proyecto"
    )

    # Metadatos del modelo
    class Meta:
        verbose_name = "Proyecto"
        verbose_name_plural = "Proyectos"
        ordering = ['-created_at']

    def __str__(self):
        return self.nombre

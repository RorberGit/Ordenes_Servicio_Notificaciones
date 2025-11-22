from django.db import models

from template.models import FieldsTemplate


class Obra(FieldsTemplate):
    """Modelo de Obra
    Este modelo representa los obras que pueden tener múltiples órdenes de servicio y notificaciones.
    """
    # Nombre del obra
    nombre = models.CharField(
        max_length=255,
        unique=True,
        verbose_name="Nombre de la Obra",
        help_text="Nombre único de la obra"
    )

    # Descripción del obra
    descripcion = models.TextField(
        blank=True,
        null=True,
        verbose_name="Descripción",
        help_text="Descripción detallada de la obra"
    )

    # Metadatos del modelo
    class Meta:
        verbose_name = "Obra"
        verbose_name_plural = "Obras"
        ordering = [
            '-created_at']

    def __str__(self):
        return self.nombre

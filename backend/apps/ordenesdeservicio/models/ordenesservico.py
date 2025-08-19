# Importa el módulo de modelos de Django
from django.db import models

# Importa el modelo de usuario predeterminado de Django
from django.contrib.auth.models import User

from template.models import FieldsTemplate


class OrdenesServicio(FieldsTemplate):
    """Modelo de Ordenes de Servicio
    Este modelo representa las órdenes de servicio recividas dede la obra en construccion.
        Cada orden tiene un número único,
        un asunto con la descripción del servicio,
        un responsable que es el usuario que crea el servicio,
        fecha en que se notifica la orden de servicio,
        notificación a la que responde (relación con tabla de notificaciones), puede estar en blanco,
        tipo de contenido (relación con tabla de tipos de contenido),
        especialidad (relación con tabla de especialidades), puede estar en blanco,
        estado de la orden (pendiente, en proceso, completado)
    """
    # Número de la orden de servicio
    numero_orden = models.CharField(
        max_length=20,
        unique=True,
        verbose_name="Número de Orden",
        help_text="Número único de la orden de servicio"
    )

    # Asunto de la orden de servicio
    asunto = models.CharField(
        max_length=255,
        verbose_name="Asunto",
        help_text="Descripción breve del servicio solicitado"
    )

    # Responsable de la orden de servicio (usuario que crea la orden)
    responsable = models.ForeignKey(
        User,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name="Responsable",
        help_text="Usuario responsable de la orden de servicio"
    )

    # Fecha de notificación de la orden de servicio
    fecha_notificacion = models.DateField(
        auto_now_add=True,
        blank=True,
        null=True,
        verbose_name="Fecha de Notificación",
        help_text="Fecha y hora en que se notificó la orden de servicio"
    )

    # Notificación a la que responde (opcional)
    notificacion = models.ForeignKey(
        'notificaciones.Notificacion',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Notificación",
        help_text="Notificación a la que responde esta orden de servicio"
    )

    # Tipo de contenido relacionado con la orden de servicio
    tipo_contenido = models.ForeignKey(
        'tiposdecontenido.TipoContenido',
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name="Tipo de Contenido",
        help_text="Tipo de contenido relacionado con la orden de servicio"
    )

    # Especialidad relacionada con la orden de servicio (opcional)
    especialidad = models.ForeignKey(
        'especialidades.Especialidad',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Especialidad",
        help_text="Especialidad relacionada con la orden de servicio"
    )

    # Estado de la orden de servicio (pendiente, en proceso, completado)
    ESTADO_CHOICES = [
        ('pendiente',
         'Pendiente'),
        ('en_proceso',
         'En Proceso'),
        ('completado',
         'Completado'),
    ]

    estado = models.CharField(
        max_length=20,
        choices=ESTADO_CHOICES,
        default='pendiente',
        verbose_name="Estado",
        help_text="Estado actual de la orden de servicio"
    )

    # Metadatos del modelo
    class Meta:
        # Nombre en plural para el modelo
        verbose_name_plural = "Órdenes de Servicio"
        # Nombre en singular para el modelo
        verbose_name = "Orden de Servicio"

    def __str__(self):
        return f"Orden #{self.numero_orden} - {self.asunto}"

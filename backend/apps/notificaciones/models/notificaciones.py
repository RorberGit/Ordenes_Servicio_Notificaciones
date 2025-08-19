from django.db import models

from template.models import FieldsTemplate


class Notificacion(FieldsTemplate):
    """Modelo de Notificación
    Este modelo representa las notificaciones recibidas desde la obra.
        Cada notificación tiene un número único,
        Cada notificación tiene un asunto (descripción breve del contenido),
        una fecha de notificación (fecha en que se recibió la notificación),
        lleva respuesta (booleano que indica si se requiere una respuesta),
        número de la orden de servicio a la que responde, (solo en caso de que lleva respuesta sea si),
        pendiente de respuesta (booleano que indica si la notificación está pendiente de respuesta),
        tipo de respuesta (relación con tabla de tipos de respuesta, en caso de que pendiente de respuesta si),
        un estado (pendiente, en proceso, completado).
    """
    # Número de notificación
    numero_orden = models.CharField(
        max_length=20,
        unique=True,
        verbose_name="Número de Orden",
        help_text="Número único de la orden de servicio"
    )

    # Asunto de la notificación
    asunto = models.CharField(
        max_length=255,
        verbose_name="Asunto",
        blank=True,
        null=True,
        help_text="Descripción breve del contenido de la notificación"
    )

    # Fecha de notificación
    fecha_notificacion = models.DateField(
        auto_now_add=True,
        verbose_name="Fecha de Notificación",
        help_text="Fecha y hora en que se recibió la notificación"
    )

    # Lleva respuesta (booleano)
    lleva_respuesta = models.BooleanField(
        default=False,
        verbose_name="Lleva Respuesta",
        help_text="Indica si la notificación requiere una respuesta"
    )

    # Número de la orden de servicio a la que responde (opcional)
    numero_orden_respuesta = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        verbose_name="Número de Orden de Respuesta",
        help_text="Número de la orden de servicio a la que responde esta notificación"
    )

    # Pendiente de respuesta (booleano)
    pendiente_respuesta = models.BooleanField(
        default=True,
        verbose_name="Pendiente de Respuesta",
        help_text="Indica si la notificación está pendiente de respuesta"
    )

    # Tipo de respuesta (relación con tabla de tipos de respuesta)
    tipo_respuesta = models.ForeignKey(
        'tiposderespuesta.TipoDeRespuesta',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name="Tipo de Respuesta",
        help_text="Tipo de respuesta asociada a la notificación"
    )

    # Estado de la notificación (pendiente, en proceso, completado)
    estado = models.CharField(
        max_length=20,
        choices=[
            ('pendiente',
             'Pendiente'),
            ('en_proceso',
             'En Proceso'),
            ('completado',
             'Completado')
        ],
        default='pendiente',
        verbose_name="Estado",
        help_text="Estado actual de la notificación"
    )

    class Meta:
        verbose_name = "Notificación"
        verbose_name_plural = "Notificaciones"
        ordering = [
            '-fecha_notificacion']

    def __str__(self):
        return f"Notificación #{self.numero_orden} - {self.asunto}"

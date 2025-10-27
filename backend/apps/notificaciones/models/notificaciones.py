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
    numero_notificacion = models.IntegerField(
        unique=True,
        verbose_name="Número de Notificación",
        help_text="Número único de la notificación"
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

    # Especialidades relacionadas con la notificación (opcional)
    especialidad = models.ManyToManyField(
        'especialidades.Especialidad',
        related_name="notificacion",
        blank=True,
        verbose_name="Especialidad",
        help_text="Especialidades relacionadas con la notificación"
    )

    # Proyecto relacionado con la notificación (1:n)
    proyecto = models.ForeignKey(
        'proyecto.Proyecto',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name="Proyecto",
        help_text="Proyecto al que pertenece esta notificación"
    )

    # Número de la orden de servicio a la que responde (opcional)
    numero_orden_respuesta = models.ForeignKey(
        'ordenesdeservicio.OrdenesServicio',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ordenes',
        related_query_name='orden',
        verbose_name="Número de Orden de Respuesta",
        help_text="Número de la orden de servicio a la que responde esta notificación"
    )

    # Tipo de respuesta (relación con tabla de tipos de contenido)
    tipo_respuesta = models.ForeignKey(
        'tiposdecontenido.TipoContenido',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name="Tipo de Respuesta",
        help_text="Tipo de respuesta asociada a la notificación"
    )

    # Estado de la notificación
    estado = models.ForeignKey(
        'comun.Estado',
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        verbose_name="Estado",
        help_text="Estado actual de la notificación"
    )

    class Meta:
        verbose_name = "Notificación"
        verbose_name_plural = "Notificaciones"
        ordering = [
            '-fecha_notificacion']

    def __str__(self):
        return f"Notificación #{self.numero_notificacion} - {self.asunto}"


class HistoricoNotificacion(FieldsTemplate):
    """Modelo de Histórico de Notificaciones
    Este modelo registra el historial de estados de las notificaciones.
    """
    # Relación con la notificación
    notificacion = models.ForeignKey(
        Notificacion,
        on_delete=models.CASCADE,
        related_name='historicos',
        verbose_name="Notificación",
        help_text="Notificación a la que pertenece este registro histórico"
    )

    # Estado de la notificación
    estado = models.ForeignKey(
        'comun.Estado',
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        verbose_name="Estado",
        help_text="Estado de la notificación en este momento histórico"
    )
    
    # Fecha del cambio de estado
    fecha = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha",
        help_text="Fecha y hora en que se registró este estado"
    )

    # Usuario que creó este registro histórico
    user = models.ForeignKey(
        'usuarios.Usuarios',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name="Usuario",
        help_text="Usuario que registró este cambio de estado"
    )

    # Resumen del cambio histórico
    resumen = models.TextField(
        blank=True,
        null=True,
        verbose_name="Resumen",
        help_text="Resumen del cambio histórico"
    )

    # Metadatos del modelo
    class Meta:
        verbose_name = "Histórico Notificación"
        verbose_name_plural = "Históricos Notificaciones"
        # Ordenar por fecha descendente
        ordering = [
            '-created_at']

    def __str__(self):
        return f"{self.notificacion.numero_notificacion} - {self.estado} - {self.created_at}"

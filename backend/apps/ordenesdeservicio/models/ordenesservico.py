# Importa el módulo de modelos de Django
from django.db import models

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
    numero_orden = models.IntegerField(
        unique=True,
        verbose_name="Número de Orden",
        help_text="Número único de la orden de servicio (auto-incremental)"
    )

    # Asunto de la orden de servicio
    asunto = models.CharField(
        max_length=255,
        verbose_name="Asunto",
        help_text="Descripción breve del servicio solicitado"
    )

    # Fecha de notificación de la orden de servicio
    fecha_notificacion = models.DateField(
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
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name="Tipo de Contenido",
        help_text="Tipo de contenido asociada a la Orden de servicio"
    )

    # Especialidad relacionada con la orden de servicio (opcional)
    especialidad = models.ManyToManyField(
        'especialidades.Especialidad',
        related_name="ordenes",
        blank=True,
        verbose_name="Especialidad",
        help_text="Especialidad relacionada con la orden de servicio"
    )

    # Obra relacionado con la orden de servicio (1:n)
    obra = models.ForeignKey(
        'obra.Obra',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name="Obra",
        help_text="Obra al que pertenece esta orden de servicio"
    )

    # Estado de la orden de servicio
    estado = models.ForeignKey(
        'comun.Estado',
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        verbose_name="Estado",
        help_text="Estado actual de la orden de servicio"
    )

    # Indica si la orden lleva respuesta
    lleva_respuesta = models.BooleanField(
        default=False,
        verbose_name="Lleva Respuesta",
        help_text="Indica si la orden de servicio lleva una respuesta"
    )

    # Metadatos del modelo
    class Meta:
        # Nombre en plural para el modelo
        verbose_name_plural = "Órdenes de Servicio"
        # Nombre en singular para el modelo
        verbose_name = "Orden de Servicio"

    def __str__(self):
        return f"Orden #{self.numero_orden} - {self.asunto}"


class HistoricoOS(FieldsTemplate):
    """Modelo de Histórico de Órdenes de Servicio
    Este modelo registra el historial de estados de las órdenes de servicio.
    """
    # Relación con la orden de servicio
    orden_servicio = models.ForeignKey(
        OrdenesServicio,
        on_delete=models.CASCADE,
        related_name='historicos',
        verbose_name="Orden de Servicio",
        help_text="Orden de servicio a la que pertenece este registro histórico"
    )

    # Estado de la orden de servicio
    estado = models.ForeignKey(
        'comun.Estado',
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        verbose_name="Estado",
        help_text="Estado actual de la orden de servicio"
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
        verbose_name = "Histórico OS"
        verbose_name_plural = "Históricos OS"
        # Ordenar por fecha descendente
        ordering = ['-fecha']

    def __str__(self):
        return f"{self.orden_servicio.numero_orden} - {self.estado} - {self.fecha}"

# Importa el módulo de modelos de Django
from django.db import models
# Importa el modelo de usuario predeterminado de Django
from django.contrib.auth.models import User

from template.models import FieldsTemplate


class OrdenesServicio(FieldsTemplate):
    # Campos del modelo
    numero_orden = models.CharField(
        # Número único de la orden
        max_length=20, unique=True,
    )
    cliente = models.CharField(
        # Nombre del cliente
        max_length=100,
    )
    # Descripción del servicio
    descripcion = models.TextField()
    estado = models.CharField(
        max_length=20,
        choices=[
            ('pendiente',
             'Pendiente'),
            ('en_proceso',
             'En Proceso'),
            ('completado',
             'Completado'),
        ],
        # Estado de la orden
        default='pendiente',
    )
    usuario_creador = models.ForeignKey(
        User,  # Relación con el modelo de usuario
        # Si el usuario se elimina, también se eliminan sus órdenes
        on_delete=models.CASCADE,
        # Nombre para acceder a las órdenes desde el usuario
        related_name='ordenes_creadas',
    )
    fecha_registro = models.DateTimeField(
        # Fecha en que fue registrada la orden
        auto_now_add=True,
    )
    fecha_notificacion = models.DateTimeField(
        # Puede ser nulo o estar vacío si aún no ha sido notificada
        null=True, blank=True,
    )

    def __str__(self):
        return f"Orden #{self.numero_orden} - {self.cliente}"

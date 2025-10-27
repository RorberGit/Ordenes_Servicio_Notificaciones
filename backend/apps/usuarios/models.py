from django.db import models

from template.models import FieldsTemplate


class Permisos(FieldsTemplate):
    """Modelo de Permisos
    Este modelo registra los permisos de acceso de los usuarios a diferentes proyectos.
    Un usuario puede tener acceso a múltiples proyectos.
    """
    usuario = models.ForeignKey(
        'Usuarios',
        on_delete=models.CASCADE,
        related_name='permisos',
        verbose_name="Usuario",
        help_text="Usuario al que se le otorgan permisos"
    )

    proyecto = models.ForeignKey(
        'proyecto.Proyecto',
        on_delete=models.CASCADE,
        verbose_name="Proyecto",
        help_text="Proyecto al que tiene acceso el usuario"
    )

    # Tipo de permiso (opcional, para futuras expansiones)
    tipo_permiso = models.CharField(
        max_length=50,
        default='lectura',
        verbose_name="Tipo de Permiso",
        help_text="Tipo de permiso otorgado (lectura, escritura, etc.)"
    )

    class Meta:
        verbose_name = "Permiso"
        verbose_name_plural = "Permisos"
        unique_together = ('usuario', 'proyecto')

    def __str__(self):
        return f"{self.usuario.username} - {self.proyecto.nombre} ({self.tipo_permiso})"


class Rol(FieldsTemplate):
    """Modelo de Rol
    Este modelo representa los roles de los usuarios.
    """
    nombre = models.CharField(
        max_length=50,
        unique=True,
        verbose_name="Nombre del Rol",
        help_text="Nombre único del rol"
    )

    descripcion = models.TextField(
        blank=True,
        null=True,
        verbose_name="Descripción",
        help_text="Descripción del rol"
    )

    class Meta:
        verbose_name = "Rol"
        verbose_name_plural = "Roles"

    def __str__(self):
        return self.nombre


class Usuarios(FieldsTemplate):
    """Modelo de Usuario
    Este modelo representa los usuarios del sistema.
    """
    username = models.CharField(
        max_length=150,
        unique=True,
        verbose_name="Nombre de Usuario",
        help_text="Nombre de usuario único"
    )

    fullname = models.CharField(
        max_length=255,
        verbose_name="Nombre Completo",
        help_text="Nombre completo del usuario"
    )

    active = models.BooleanField(
        default=False,
        verbose_name="Activo",
        help_text="Indica si el usuario está activo"
    )

    rol = models.ForeignKey(
        Rol,
        on_delete=models.CASCADE,
        verbose_name="Rol",
        help_text="Rol del usuario"
    )

    proyecto_principal = models.ForeignKey(
        'proyecto.Proyecto',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name="Proyecto Principal",
        help_text="Proyecto principal al que pertenece el usuario"
    )

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"

    def __str__(self):
        return f"{self.fullname} ({self.username})"

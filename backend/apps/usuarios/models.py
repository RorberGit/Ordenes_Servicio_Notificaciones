# apps.usuarios.models.py

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

from apps.obra.models import Obra
from rega.unidad.models import Unidad
from template.models import FieldsTemplate


class UsuariosManager(BaseUserManager):
    def create_user(self, username, fullname, password=None, **extra_fields):
        if not username:
            raise ValueError(
                'El nombre de usuario es obligatorio')
        user = self.model(
            username=username, fullname=fullname, **extra_fields)
        user.set_password(
            password)
        user.save(
            using=self._db)
        return user

    def create_superuser(self, username, fullname, password=None, **extra_fields):
        extra_fields.setdefault(
            'is_staff', True)
        extra_fields.setdefault(
            'is_superuser', True)
        return self.create_user(username, fullname, password, **extra_fields)


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


class Usuarios(AbstractBaseUser, PermissionsMixin):
    """Modelo de Usuario
    Este modelo representa los usuarios del sistema.
    """
    id = models.AutoField(
        primary_key=True)
    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name="Creado")
    updated_at = models.DateTimeField(
        auto_now=True, verbose_name="Actualizado")
    date_joined = models.DateTimeField(
        default=timezone.now)

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

    email = models.CharField(
        max_length=200,
        default="",
        null=True,
        blank=True,
        verbose_name="Correo electronico",
        help_text="Dirección email del usuario"
    )

    active = models.BooleanField(
        default=True,
        verbose_name="Activo",
        help_text="Indica si el usuario está activo"
    )

    is_staff = models.BooleanField(
        default=False)
    is_active = models.BooleanField(
        default=True)

    rol = models.ForeignKey(
        Rol,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        verbose_name="Rol",
        help_text="Rol del usuario"
    )

    obra_principal = models.ForeignKey(
        'obra.Obra',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name="Obra Principal",
        help_text="Obra principal al que pertenece el usuario"
    )

    obras_permitidas = models.ManyToManyField(
        Obra,
        related_name='usuarios_permitidos',
        verbose_name="Obras Permitidas",
        help_text="Obras a las que el usuario tiene acceso"
    )

    unidad = models.ForeignKey(
        Unidad,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Unidad",
        help_text="Unidad a la que pertenece el usuario"
    )

    objects = UsuariosManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = [
        'fullname']

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"

    def __str__(self):
        return f"{self.fullname} ({self.username})"

    @property
    def is_approved(self):
        """Propiedad para verificar si el usuario está aprobado (activo)"""
        return self.active

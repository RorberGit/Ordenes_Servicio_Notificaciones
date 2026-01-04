from django.db import models
from simple_history.models import HistoricalRecords

from template.models import FieldsTemplate

from django.core.validators import FileExtensionValidator

import unicodedata
import os

from django.utils.text import slugify


def limpiar_nombre_archivo(nombre):
    nombre_base, extension = os.path.splitext(
        nombre)

    # Normaliza caracteres Unicode (ñ, tildes, diéresis)
    nombre_normalizado = unicodedata.normalize(
        'NFKD', nombre_base)
    nombre_ascii = nombre_normalizado.encode(
        'ascii', 'ignore').decode('ascii')

    # Opcional: slugify para mayor seguridad
    nombre_limpio = slugify(
        nombre_ascii)

    return f"{nombre_limpio}{extension.lower()}"


def ruta_archivo(instance, filename):
    return f"documentos/{instance.created_at.year}/{instance.created_at.month}/{limpiar_nombre_archivo(filename)}"


class Registro(FieldsTemplate):
    num = models.IntegerField(
        unique=True,
        verbose_name="Número",
        help_text="Número"
    )
    descripcion = models.TextField(
        blank=True,
        verbose_name="Descripción",
        help_text="Descripción opcional"
    )

    procedencia_destino = models.ForeignKey(
        'procedencia_destino.ProcedenciaDestino',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Procedencia o destino",
        help_text="Procedencia o destino"
    )

    tipo_documento = models.ForeignKey(
        "tipo_documento.TipoDocumento",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Tipo de documento",
        help_text="Tipo de documento"
    )

    usuario = models.ForeignKey(
        "usuarios.Usuarios",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Usuario",
        help_text="Usuarios"
    )

    usuario_nombre = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name="Nombre de usuario",
        help_text="Nombre de usuario"
    )

    unidad = models.ForeignKey(
        "unidad.Unidad",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Unidad",
        help_text="Unidades"
    )

    unidad_nombre = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name="Nombre de unidad",
        help_text="Nombre de unidad"
    )

    ent_sal = models.CharField(
        max_length=3,
        choices=[
            ('R/E', 'R/E'), ('R/S', 'R/S')],
        null=True,
        blank=True,
        verbose_name="Entrada/Salida",
        help_text="R/E para Entrada, R/S para Salida"
    )

    archivo = models.FileField(
        null=True,
        blank=True,
        upload_to=ruta_archivo,
        validators=[FileExtensionValidator(
            allowed_extensions=[
                'pdf', 'doc', 'docx', 'xls', 'xlsx'
            ]
        )]
    )

    history = HistoricalRecords()

    def save(self, *args, **kwargs):
        if not self.usuario_nombre and self.usuario:
            self.usuario_nombre = self.usuario.fullname
        if self.unidad:
            self.unidad_nombre = self.unidad.descripcion
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Registro"
        verbose_name_plural = "Registros"

    def __str__(self):
        return f"{self.num} - {self.descripcion}"

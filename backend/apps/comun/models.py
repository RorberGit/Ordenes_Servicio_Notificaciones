from django.db import models

# Create your models here.


class Estado(models.Model):
    nombre = models.CharField(
        verbose_name='estado',
        max_length=20,
        unique=True
    )

# Metadatos del modelo
    class Meta:
        verbose_name = "Estado"
        verbose_name_plural = "Estados"

    def __str__(self):
        return self.nombre

import uuid
from django.db import models


class FieldsTemplate(models.Model):
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name=("created_at"))
    updated_at = models.DateTimeField(
        auto_now=True, verbose_name=("updated at"))

    class Meta:
        abstract = True

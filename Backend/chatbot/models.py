from django.db import models

# Create your models here.
from django.db import models


class ChatMessage(models.Model):

    user_id = models.CharField(max_length=255)

    role = models.CharField(
        max_length=20
    )

    content = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["created_at"]
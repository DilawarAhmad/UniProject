from django.db import models

# Create your models here.
from django.db import models



class Conversation(models.Model):

    user_id = models.CharField(
        max_length=255
    )

    title = models.CharField(
        max_length=255,
        default="New Conversation"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )


class ChatMessage(models.Model):
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages",
    )
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


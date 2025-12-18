from django.db import models

class Roadmap(models.Model):
    user_id = models.CharField(max_length=100)

    target_role = models.CharField(max_length=100)
    steps = models.JSONField()  # store roadmap steps as JSON list
    progress = models.IntegerField(default=0)  # e.g. 60 = 60%

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_id} - {self.target_role}"

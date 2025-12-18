from django.db import models

class Skill(models.Model):
    user_id = models.CharField(max_length=100)  # supabase UID

    name = models.CharField(max_length=100)
    level = models.IntegerField(default=0)  # 0-100
    confidence = models.FloatField(default=0.0)  # from AI parsing

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.level}%)"

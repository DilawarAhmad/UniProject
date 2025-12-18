from django.db import models

class UserProfile(models.Model):
    # Supabase Auth User ID (UUID string)
    user_id = models.CharField(max_length=100, unique=True)

    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True, null=True)

    skill_score = models.IntegerField(default=0)
    roadmap_progress = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name

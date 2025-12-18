from django.db import models

class Resume(models.Model):
    user_id = models.CharField(max_length=100)  # supabase UID

    resume_url = models.URLField()
    parsed_text = models.TextField(blank=True, null=True)  # after NLP processing

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Resume - {self.user_id}"

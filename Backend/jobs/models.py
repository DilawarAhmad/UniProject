from django.db import models
from django.contrib.auth.models import User


class SavedJob(models.Model):
    user_id = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255, null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    link = models.URLField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)


class AppliedJob(models.Model):
    user_id = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255, null=True, blank=True)
    link = models.URLField()
    status = models.CharField(
        max_length=50,
        choices=[
            ("applied", "Applied"),
            ("interview", "Interview"),
            ("rejected", "Rejected"),
            ("offer", "Offer"),
        ],
        default="applied"
    )
    created_at = models.DateTimeField(auto_now_add=True)
from django.urls import path
from .views import get_jobs_for_user

urlpatterns = [
    path("recommend/<str:user_id>/", get_jobs_for_user)
]
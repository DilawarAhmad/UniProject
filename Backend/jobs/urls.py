from django.urls import path
from .views import get_jobs_for_user
from django.urls import path
from .views_dashboard import *


urlpatterns = [
    path("recommend/<str:user_id>/", get_jobs_for_user),
    path("save/<str:user_id>/", save_job),
    path("saved/<str:user_id>/", get_saved_jobs),
    path("applied/<str:user_id>/", get_applied_jobs),
    path("delete/<str:user_id>/", delete_saved_job),
    path("apply/<str:user_id>/", apply_job),
    path("update-status/<str:user_id>/", update_job_status),
    path("delete-applied/<str:user_id>/", delete_applied_job),
]
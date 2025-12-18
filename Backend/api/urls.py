from django.urls import path
# from .views import process_resume, manual_skills, github_skills
from skills.views import get_user_skills
from .views import generate_profile

urlpatterns = [
    # path("process-resume/", process_resume, name="process_resume"),
    # path("manual-skills/", manual_skills, name="manual_skills"),
    # path("github-skills/", github_skills, name="github_skills"),
    path("get-skills/<str:user_id>/", get_user_skills, name="get_user_skills"),
    path("generate-profile/", generate_profile, name="github_skills"),

]
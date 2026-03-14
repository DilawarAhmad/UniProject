from rest_framework.decorators import api_view
from rest_framework.response import Response
from skills.models import Skill
from .services import fetch_jobs
from .utils import get_skill_names


@api_view(["GET"])
def get_jobs_for_user(request, user_id):


    skills = Skill.objects.filter(user_id=user_id)


    if not skills.exists():
        print("no skills found")
        return Response({"jobs": []})

    skill_names = get_skill_names(skills)


    jobs = fetch_jobs(skill_names, limit=15)


    return Response({
        "skills_used": skill_names,
        "jobs": jobs
    })
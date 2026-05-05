from rest_framework.decorators import api_view
from rest_framework.response import Response
from skills.models import Skill
from .utils import get_skill_names
from .job_sources import fetch_jobs, get_trending_roles

@api_view(["GET"])
def get_jobs_for_user(request, user_id):

    skills = Skill.objects.filter(user_id=user_id)
    print("skills are in view ",skills)
    if not skills.exists():
        return Response({"recommended_jobs": [], "trending_jobs":[]})
    skill_names = get_skill_names(skills)
    jobs = fetch_jobs(skill_names)
    trending = get_trending_roles(jobs)
    return Response({
        "skills_used": skill_names,
        "recommended_jobs": jobs,
        "trending_jobs": trending
    })

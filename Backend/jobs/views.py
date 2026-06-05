from rest_framework.decorators import api_view
from rest_framework.response import Response
from skills.models import Skill
from .utils import get_skill_names
from .job_sources import get_trending_roles,build_query,build_roles,select_roles,scrape_naukri,scrape_linkedin

@api_view(["GET"])
def get_jobs_for_user(request, user_id):

    skills = Skill.objects.filter(user_id=user_id)
    print("skills are in view ",skills)
    if not skills.exists():
        return Response({"recommended_jobs": [], "trending_jobs":[]})
    skill_names = get_skill_names(skills)
    skills = [s.lower() for s in skill_names]

    # build roles
    role_counter = build_roles(skills)

    # select best roles
    roles = select_roles(role_counter)

    # build query
    query = build_query(roles, skills)
    jobs1 = scrape_linkedin(query)
    jobs2 = scrape_naukri(query)
    jobs = jobs1+jobs2
    trending = get_trending_roles(jobs)
    return Response({
        "skills_used": skill_names,
        "recommended_jobs": jobs,
        "trending_jobs": trending
    })

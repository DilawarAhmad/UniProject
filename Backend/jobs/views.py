from rest_framework.decorators import api_view
from rest_framework.response import Response
from skills.models import Skill
from .utils import get_skill_names

from .job_service import fetch_all_jobs
from .job_matcher import rank_jobs, diversify_jobs


@api_view(["GET"])
def get_jobs_for_user(request, user_id):

    skills = Skill.objects.filter(user_id=user_id)

    if not skills.exists():
        return Response({"recommended_jobs": []})

    skill_names = get_skill_names(skills)

    # 🔥 multi-source fetch
    jobs = fetch_all_jobs(skill_names)

    # 🔥 ranking
    ranked_jobs = rank_jobs(jobs, skill_names)

    # 🔥 diversification (VERY IMPORTANT)
    recommended = diversify_jobs(ranked_jobs, limit=10)

    # 🔥 internships
    internships = [
        j for j in ranked_jobs
        if "intern" in (j["title"] or "").lower()
    ][:6]

    # 🔥 trending (based on most frequent roles)
    role_count = {}

    for job in ranked_jobs[:30]:
        title = (job.get("title") or "").lower()

        if "frontend" in title:
            role = "Frontend"
        elif "backend" in title:
            role = "Backend"
        elif "full" in title:
            role = "Fullstack"
        elif "data" in title:
            role = "Data"
        elif "ai" in title:
            role = "AI/ML"
        else:
            role = "Other"

        role_count[role] = role_count.get(role, 0) + 1

    trending = [
        {"role": k, "openings": v}
        for k, v in role_count.items()
    ]

    return Response({
        "skills_used": skill_names,
        "recommended_jobs": recommended,
        "internships": internships,
        "trending_jobs": trending
    })
from rest_framework.decorators import api_view
from rest_framework.response import Response
from skills.models import Skill
from .utils import get_skill_names
from .job_sources import get_trending_roles,build_query,build_roles,select_roles,scrape_naukri,scrape_linkedin
from skills_extractor import extract_skills

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


@api_view(["POST"])
def compare_job(request, user_id):

    description = request.data.get(
        "description",
        ""
    )
    print("description ",description)
    # skills extracted from job description
    job_skills = set(
        skill.lower()
        for skill in extract_skills(description)
    )

    # skills stored for user
    user_skills = set(
        skill.lower()
        for skill in Skill.objects
        .filter(user_id=user_id)
        .values_list("name", flat=True)
    )
    print("user skills",user_skills)
    print("jobs skills",job_skills)
    matched = []
    missing = []

    for skill in job_skills:

        if skill in user_skills:
            matched.append(skill)
        else:
            missing.append(skill)

    score = 0

    if len(job_skills) > 0:
        score = round(
            len(matched)
            / len(job_skills)
            * 100
        )

    return Response({

        "job_skills": sorted(
            list(job_skills)
        ),

        "matched_skills": sorted(
            matched
        ),

        "missing_skills": sorted(
            missing
        ),

        "match_score": score,
    })
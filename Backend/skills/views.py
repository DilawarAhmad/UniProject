from rest_framework.decorators import api_view
from rest_framework.response import Response
from skills.models import Skill

@api_view(["GET"])
def get_user_skills(request, user_id):
    skills = Skill.objects.filter(user_id=user_id)

    if not skills.exists():
        return Response({"skills": [], "score": 0})

    skill_data = [
        {"name": s.name, "level": s.level, "confidence": s.confidence}
        for s in skills
    ]

    avg_score = round(sum(s.level for s in skills) / len(skills))

    return Response({"skills": skill_data, "score": avg_score})

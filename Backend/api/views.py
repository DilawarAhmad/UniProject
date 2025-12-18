# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status
# from resume.models import Resume
# from skills.models import Skill
# from skills_extractor import extract_skills
# import requests
# import fitz  # PyMuPDF (pip install pymupdf)


# # -----------------------------
# # Helper: Extract text from PDF
# # -----------------------------
# def extract_text_from_pdf_url(url):
#     response = requests.get(url)
#     if response.status_code != 200:
#         raise Exception("Failed to fetch PDF from Supabase")

#     pdf_bytes = response.content
#     pdf = fitz.open(stream=pdf_bytes, filetype="pdf")

#     text = ""
#     for page in pdf:
#         page_text = page.get_text("text") or ""
#         text += page_text + "\n"

#     if not text.strip():
#         raise Exception("No readable text extracted from PDF")

#     print(f"Extracted {len(text)} characters from resume.")
#     return text



# # -----------------------------
# # API: Process Uploaded Resume
# # -----------------------------
# @api_view(["POST"])
# def process_resume(request):
#     user_id = request.data.get("user_id")
#     print("🧑 User ID:", user_id)

#     resume_url = request.data.get("resume_url")

#     if not user_id or not resume_url:
#         return Response({"error": "user_id & resume_url required"}, status=400)

#     try:
#         # ✅ Extract text from PDF
#         text = extract_text_from_pdf_url(resume_url)

#         # ✅ Extract skills using your extractor
#         skills = extract_skills(text)
#         score = min(len(skills) * 10, 100)


#         # ✅ Clear old skills and insert new ones
#         # Resume.objects.filter(user_id=user_id).delete()
#         # Skill.objects.filter(user_id=user_id).delete()
#         # ✅ Save resume info
#         Resume.objects.create(
#             user_id=user_id,
#             resume_url=resume_url,
#             parsed_text=text
#         )
#         #new thing added 
#         existing_skills = set(Skill.objects.filter(user_id=user_id).values_list("name", flat=True))
#         new_skills = [skill for skill in skills if skill not in existing_skills]

        
#         for i, skill in enumerate(new_skills):
#             Skill.objects.create(
#                 user_id=user_id,
#                 name=skill,
#                 level=50 + i * 5 if i * 5 <= 50 else 95,  # simulate variety
#                 confidence=round(0.6 + (i / len(skills)) * 0.4, 2)  # 0.6–1.0 range
#             )

#         return Response({
#             "message": "Resume processed",
#             "skills": [{"name": s, "level": 70, "confidence": 0.85} for s in skills],
#             "score": score
#         })
#     except Exception as e:
#         print("❌ Error in process_resume:", e)
#         return Response({"error": str(e)}, status=500)



# # -----------------------------
# # API: Manual Skills Entry
# # -----------------------------
# @api_view(["POST"])
# def manual_skills(request):
#     user_id = request.data.get("user_id")
#     skills = request.data.get("skills", [])
#     print("manual skills", skills)

#     if not user_id or not skills:
#         return Response({"error": "user_id and skills required"}, status=status.HTTP_400_BAD_REQUEST)

#     # ✅ Clear existing skills and insert new
#     # Skill.objects.filter(user_id=user_id).delete()
#     existing_skills = set(Skill.objects.filter(user_id=user_id).values_list("name", flat=True))
#     new_skills = [skill for skill in skills if skill not in existing_skills]
#     for skill in new_skills:
#         Skill.objects.create(user_id=user_id, name=skill, level=65, confidence=0.75)

#     score = min(len(skills) * 10, 100)

#     return Response({
#         "message": "Skills saved",
#         "skills": [{"name": s, "level": 65, "confidence": 0.75} for s in skills],
#         "score": score
#     })


# #Github extraction from here
# @api_view(["POST"])
# def github_skills(request):
#     username = request.data.get("github_username")
#     user_id = request.data.get("user_id")

#     if not username or not user_id:
#         return Response({"error": "GitHub username & user_id required"}, status=400)

#     repos_url = f"https://api.github.com/users/{username}/repos"
#     repos = requests.get(repos_url).json()

#     if isinstance(repos, dict) and repos.get("message") == "Not Found":
#         return Response({"error": "GitHub user not found"}, status=404)

#     extracted = set()
#     for repo in repos:
#         if repo.get("language"):
#             extracted.add(repo["language"].lower())
#         for topic in repo.get("topics", []):
#             extracted.add(topic.lower())

#     extracted = list(extracted)
#     print("github skills",extracted)
#     existing = set(Skill.objects.filter(user_id=user_id).values_list("name", flat=True))
#     new_skills = [s for s in extracted if s not in existing]

#     for s in new_skills:
#         Skill.objects.create(
#             user_id=user_id,
#             name=s,
#             level=70,
#             confidence=0.85
#         )

#     return Response({
#         "message": "GitHub skills processed",
#         "added_skills": new_skills,
#         "skipped_skills": list(existing & set(extracted)),
#         "total_skills_now": Skill.objects.filter(user_id=user_id).count()
#     })



from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from resume.models import Resume
from skills.models import Skill
from skills_extractor import extract_skills
import requests
import fitz  # PyMuPDF

# -----------------------------
# Helper: Extract text from PDF
# -----------------------------
def extract_text_from_pdf_url(url):
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception("Failed to fetch PDF from URL")
    pdf_bytes = response.content
    pdf = fitz.open(stream=pdf_bytes, filetype="pdf")
    text = ""
    for page in pdf:
        page_text = page.get_text("text") or ""
        text += page_text + "\n"
    if not text.strip():
        raise Exception("No readable text extracted from PDF")
    return text

# -----------------------------
# Unified Skill Extraction Endpoint
# -----------------------------
@api_view(["POST"])
def generate_profile(request):
    user_id = request.data.get("user_id")
    resume_url = request.data.get("resume_url")
    manual_skills_list = request.data.get("skills", [])
    github_username = request.data.get("github_username")

    if not user_id:
        return Response({"error": "user_id is required"}, status=400)

    all_skills = set()

    # 1️⃣ Resume extraction
    if resume_url:
        try:
            text = extract_text_from_pdf_url(resume_url)
            resume_skills = extract_skills(text)
            all_skills.update(resume_skills)

            # Save/update resume record
            Resume.objects.update_or_create(
                user_id=user_id,
                defaults={"resume_url": resume_url, "parsed_text": text},
            )
        except Exception as e:
            return Response({"error": f"Resume processing failed: {str(e)}"}, status=500)

    # 2️⃣ Manual skills
    if manual_skills_list:
        all_skills.update([s.strip() for s in manual_skills_list if s.strip()])

    # 3️⃣ GitHub extraction
    if github_username:
        try:
            repos_url = f"https://api.github.com/users/{github_username}/repos"
            repos = requests.get(repos_url).json()
            if isinstance(repos, dict) and repos.get("message") == "Not Found":
                return Response({"error": "GitHub user not found"}, status=404)
            
            github_skills = set()
            for repo in repos:
                if repo.get("language"):
                    github_skills.add(repo["language"].lower())
                for topic in repo.get("topics", []):
                    github_skills.add(topic.lower())
            all_skills.update(github_skills)
        except Exception as e:
            return Response({"error": f"GitHub processing failed: {str(e)}"}, status=500)

    # 4️⃣ Save skills to DB without duplicates
    existing_skills = set(Skill.objects.filter(user_id=user_id).values_list("name", flat=True))
    new_skills = [s for s in all_skills if s not in existing_skills]

    for i, skill in enumerate(new_skills):
        Skill.objects.create(
            user_id=user_id,
            name=skill,
            level=50 + i * 5 if i * 5 <= 50 else 95,
            confidence=round(0.6 + (i / len(new_skills)) * 0.4, 2) if new_skills else 0.8
        )

    total_skills = Skill.objects.filter(user_id=user_id)
    score = min(total_skills.count() * 10, 100)

    return Response({
        "message": "Profile generated successfully",
        "skills": [{"name": s.name, "level": s.level, "confidence": s.confidence} for s in total_skills],
        "score": score
    })

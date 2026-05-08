from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests
import re
from .agent import agentFun
OLLAMA_URL = "http://localhost:11434/api/generate"


# 🔥 HARD PARSER (REBUILDS ROADMAP CLEANLY)
def clean_output(text):
    lines = text.split("\n")

    steps = []
    seen = set()

    for line in lines:
        line = line.strip()

        # 🔥 STOP if new generation starts
        if (
            "Instruction" in line or
            "User" in line or
            line.lower().startswith("generate")
        ):
            break

        match = re.match(r'^(\d+)\.\s*(.*)', line)
        if not match:
            continue

        content = match.group(2).strip()

        # Remove junk after step
        content = content.split("Instruction")[0].strip()

        # Normalize
        content = re.sub(r'\s+', ' ', content)

        if len(content) < 5:
            continue

        if content in seen:
            continue
        seen.add(content)

        steps.append(content)

    # 🔥 REMOVE SECOND ROADMAP (if numbering restarts)
    final_steps = []
    for step in steps:
        if step in final_steps:
            break
        final_steps.append(step)

    if len(final_steps) < 8:
        return ""

    # 🔥 rebuild numbering cleanly
    result = []
    for i, step in enumerate(final_steps[:20], 1):
        result.append(f"{i}. {step}")

    return "\n".join(result)
@csrf_exempt
def generate_roadmap(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request"}, status=400)

    try:
        data = json.loads(request.body)
        user_input = data.get("query", "").strip()

        if not user_input:
            return JsonResponse({"error": "Empty query"}, status=400)
        prompt = f"""
    {user_input}
    """
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": "roadmap-model",
                "prompt": prompt,
                "stream": False,
                "options": {
                "temperature": 0.05,   # 🔥 even more stable
                "top_p": 0.9,
                "repeat_penalty": 1.15,
                "num_predict": 800
            }
            }
        )

        if response.status_code != 200:
            return JsonResponse({
                "error": "Model API failed",
                "details": response.text
            }, status=500)

        result = response.json()
        raw_output = result.get("response", "")

        cleaned = clean_output(raw_output)

        # 🔥 fallback if model is too broken
        if not cleaned or len(cleaned.split("\n")) < 3:
            cleaned = (
                "1. Start with fundamentals (learn basics of the topic clearly)\n"
                "2. Practice core concepts (apply knowledge through exercises)\n"
                "3. Build small projects (gain practical experience)\n"
                "4. Learn advanced concepts (deepen understanding gradually)\n"
                "5. Work on real-world applications (simulate industry use cases)\n"
                "6. Optimize and debug (improve code quality and performance)\n"
                "7. Explore tools and frameworks (expand capabilities)\n"
                "8. Build production-ready projects (prepare for real-world use)"
            )
        final_roadmap = agentFun(user_input,cleaned)
        if not final_roadmap:
            final_roadmap = cleaned
        return JsonResponse({
            "roadmap": final_roadmap
        })

    except Exception as e:
        return JsonResponse({
            "error": "Internal server error",
            "details": str(e)
        }, status=500)
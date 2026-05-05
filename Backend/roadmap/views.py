from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests
import re

OLLAMA_URL = "http://localhost:11434/api/generate"


# 🔥 HARD PARSER (REBUILDS ROADMAP CLEANLY)
def clean_output(text):
    # Extract numbered lines properly
    matches = re.findall(r'\d+\.\s*.*', text)

    steps = []
    seen = set()

    for line in matches:
        line = line.strip()

        # 🔥 remove nested numbering like "3. something"
        line = re.sub(r'^\d+\.\s*', '', line)

        # remove extra numbering inside
        line = re.sub(r'\b\d+\.\s*', '', line)

        # normalize spaces
        line = re.sub(r'\s+', ' ', line)

        # skip junk
        if len(line) < 10:
            continue

        # ensure explanation exists
        if "(" not in line:
            line += " "

        # avoid duplicates
        if line in seen:
            continue
        seen.add(line)

        steps.append(line)

    # 🔥 rebuild clean numbering
    final_steps = []
    for i, step in enumerate(steps[:12], 1):
        final_steps.append(f"{i}. {step}")

    return "\n".join(final_steps)

@csrf_exempt
def generate_roadmap(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request"}, status=400)

    try:
        data = json.loads(request.body)
        user_input = data.get("query", "").strip()

        if not user_input:
            return JsonResponse({"error": "Empty query"}, status=400)

        # 🔥 SIMPLIFIED + STRONG PROMPT
        prompt = f"""
        Create a learning roadmap.

        STRICT FORMAT:
        1. Topic (short explanation)

        RULES:
        - ONLY ONE roadmap
        - 8 to 12 steps
        - Each step MUST have explanation in brackets
        - Do NOT repeat steps
        - Do NOT generate multiple roadmaps

        USER:
        {user_input}

        OUTPUT:
        Start EXACTLY like this:
        1.
        """

        response = requests.post(
            OLLAMA_URL,
            json={
                "model": "roadmap-model",
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.6,   # 🔥 lower = more stable
                    "top_p": 0.9,
                    "repeat_penalty": 1.2,
                    "num_predict": 300,
                    # 🔥 HARD STOP AFTER 12 STEPS
                    "stop": [
                    "\n13.", "\n14.", "\n15.",
                    "\n1. Learn",      # 🔥 stops restart
                    "\n1.",            # 🔥 critical
                    "Instruction:",
                    "User request:"
                ]
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

        return JsonResponse({
            "roadmap": cleaned
        })

    except Exception as e:
        return JsonResponse({
            "error": "Internal server error",
            "details": str(e)
        }, status=500)
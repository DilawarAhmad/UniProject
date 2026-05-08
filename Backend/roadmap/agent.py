from google import genai
from dotenv import load_dotenv
import time
import os
load_dotenv()
def agentFun(user_query,roadmap):
    YOUR_API_KEY=os.getenv("MODEL_KEY")
    client = genai.Client(api_key=YOUR_API_KEY)

    prompt = f"""
    You are an expert roadmap creator.

    The user requested this roadmap topic:
    {user_query}

    Below is an AI-generated roadmap.

    Your tasks:
    1. Check if roadmap matches the user's topic
    2. Remove irrelevant or incorrect steps
    3. Add missing important steps if needed
    4. Reorder steps logically
    5. Keep roadmap beginner-friendly
    6. Keep explanations short and practical
    7. Return ONLY the final roadmap

    Rules:
    - Numbered steps only
    - No markdown
    - No **
    - No headings
    - No phases
    - Each step should contain:
    Step title + short 2-line explanation
    - Maximum 2-3 lines per step
    - Keep output clean and readable

    Roadmap:
    {roadmap}
    """
    for attempt in range(3):

        try:

            response = client.models.generate_content(
                model="gemini-2.5-flash-lite",
                contents=prompt
            )

            if response.text:
                return response.text

        except Exception as e:

            print("Attempt failed:", str(e))
            time.sleep(2)

    return None
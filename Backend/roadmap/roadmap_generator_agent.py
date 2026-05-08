# roadmap_generator_agent.py

import requests

OLLAMA_URL = "http://localhost:11434/api/generate"


def roadmap_generator_agent(state):

    user_input = state["query"]

    response = requests.post(

        OLLAMA_URL,

        json={

            "model": "roadmap-model",

            "prompt": user_input,

            "stream": False,

            "options": {

                "temperature": 0.05,

                "top_p": 0.9,

                "repeat_penalty": 1.15,

                "num_predict": 800
            }
        }
    )

    result = response.json()

    raw_output = result.get("response", "")

    return {

        "raw_output": raw_output
    }
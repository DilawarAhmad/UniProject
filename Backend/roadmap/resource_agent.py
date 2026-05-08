# resource_agent.py

from youtube_search import YoutubeSearch
from bs4 import BeautifulSoup

import requests
import time
import re


# =========================================================
# ONLY REAL TECHNOLOGIES / FRAMEWORKS / TOOLS
# =========================================================

CS_TECHNOLOGIES = [

    # LANGUAGES
    "python",
    "javascript",
    "typescript",
    "java",
    "c++",
    "c#",
    "go",
    "rust",
    "php",
    "ruby",
    "swift",
    "kotlin",

    # FRONTEND
    "html",
    "css",
    "react",
    "nextjs",
    "vue",
    "angular",
    "tailwind",
    "redux",

    # BACKEND
    "nodejs",
    "express",
    "django",
    "flask",
    "fastapi",
    "spring boot",

    # DATABASES
    "mysql",
    "postgresql",
    "mongodb",
    "redis",
    "firebase",

    # DEVOPS
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "jenkins",
    "nginx",
    "linux",
    "terraform",

    # AI / ML
    "tensorflow",
    "pytorch",
    "numpy",
    "pandas",
    "opencv",
    "langchain",
    "langgraph",

    # API TOOLS
    "graphql",

    # TOOLS
    "git",
    "github",
    "postman",

    # MOBILE
    "react native",
    "flutter",

    # SECURITY
    "jwt"
]


# =========================================================
# TECHNOLOGY EXTRACTION
# =========================================================

def extract_technologies(parsed_steps):

    found_technologies = set()

    for step in parsed_steps:

        step_lower = step.lower()

        for keyword in CS_TECHNOLOGIES:

            # ============================================
            # FIX FALSE MATCHES
            # ============================================

            pattern = r'\b' + re.escape(keyword.lower()) + r'\b'

            if re.search(pattern, step_lower):

                found_technologies.add(keyword)

    return list(found_technologies)


# =========================================================
# YOUTUBE AGENT
# =========================================================

def youtube_agent(keyword):

    resources = []

    try:

        results = YoutubeSearch(

            f"{keyword} tutorial",

            max_results=2

        ).to_dict()

        for video in results:

            resources.append({

                "platform": "YouTube",

                "technology": keyword,

                "title": video["title"],

                "url": f"https://youtube.com{video['url_suffix']}"
            })

    except Exception as e:

        print("YouTube Error:", str(e))

    return resources


# =========================================================
# GEEKSFORGEEKS AGENT
# =========================================================

def geeksforgeeks_agent(keyword):

    resources = []

    try:

        search_keyword = keyword.lower().replace(" ", "-")

        url = f"https://www.geeksforgeeks.org/tag/{search_keyword}/"

        response = requests.get(

            url,

            headers={
                "User-Agent": "Mozilla/5.0"
            },

            timeout=10
        )

        if response.status_code == 200:

            resources.append({

                "platform": "GeeksforGeeks",

                "technology": keyword,

                "title": f"{keyword.title()} Tutorials - GeeksforGeeks",

                "url": url
            })

    except Exception as e:

        print("GFG Error:", str(e))

    return resources


# =========================================================
# DOCUMENTATION AGENT
# =========================================================

def docs_agent(keyword):

    DOCS = {

        "python": "https://docs.python.org/3/",
        "django": "https://docs.djangoproject.com/",
        "react": "https://react.dev/",
        "javascript": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        "typescript": "https://www.typescriptlang.org/docs/",
        "docker": "https://docs.docker.com/",
        "fastapi": "https://fastapi.tiangolo.com/",
        "flask": "https://flask.palletsprojects.com/",
        "langchain": "https://python.langchain.com/docs/introduction/",
        "langgraph": "https://langchain-ai.github.io/langgraph/",
        "tensorflow": "https://www.tensorflow.org/",
        "pytorch": "https://pytorch.org/docs/stable/index.html",
        "nodejs": "https://nodejs.org/en/docs",
        "postgresql": "https://www.postgresql.org/docs/",
        "mongodb": "https://www.mongodb.com/docs/",
        "redis": "https://redis.io/docs/",
        "kubernetes": "https://kubernetes.io/docs/",
        "aws": "https://docs.aws.amazon.com/",
        "git": "https://git-scm.com/doc",
        "react native": "https://reactnative.dev/docs/getting-started",
        "flutter": "https://docs.flutter.dev/"
    }

    resources = []

    keyword_lower = keyword.lower()

    if keyword_lower in DOCS:

        resources.append({

            "platform": "Documentation",

            "technology": keyword,

            "title": f"{keyword.title()} Official Documentation",

            "url": DOCS[keyword_lower]
        })

    return resources


# =========================================================
# MAIN RESOURCE AGENT
# =========================================================

def resource_agent(state):

    parsed_steps = state["parsed_steps"]

    # ============================================
    # DETECT TECHNOLOGIES
    # ============================================

    technologies = extract_technologies(parsed_steps)

    print("Detected technologies:", technologies)

    all_resources = []

    # ============================================
    # SEARCH RESOURCES
    # ============================================

    for tech in technologies:

        print(f"Searching resources for: {tech}")

        youtube_resources = youtube_agent(tech)

        gfg_resources = geeksforgeeks_agent(tech)

        docs_resources = docs_agent(tech)

        combined_resources = (

            youtube_resources +

            gfg_resources +

            docs_resources
        )

        all_resources.append({

            "technology": tech,

            "resources": combined_resources
        })

        time.sleep(1)

    return {

        "resources": all_resources
    }
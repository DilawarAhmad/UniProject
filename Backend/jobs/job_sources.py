
SKILL_TO_ROLES = {
    # Frontend
    "react": ["frontend developer", "react developer"],
    "react.js": ["frontend developer", "react developer"],
    "javascript": ["frontend developer"],
    "typescript": ["frontend developer"],
    "css": ["frontend developer"],
    "tailwind": ["frontend developer"],
    "html": ["frontend developer"],

    # Backend
    "python": ["backend developer", "python developer"],
    "django": ["backend developer", "django developer"],
    "flask": ["backend developer"],
    "node": ["backend developer"],
    "java": ["backend developer"],
    "spring": ["backend developer"],

    # Database
    "mysql": ["database engineer", "sql developer"],
    "postgresql": ["database engineer"],
    "mongodb": ["database engineer"],
    "sqlite": ["database engineer"],
    "sql": ["sql developer"],

    # DevOps / Cloud
    "docker": ["devops engineer"],
    "kubernetes": ["devops engineer"],
    "aws": ["cloud engineer"],
    "gcp": ["cloud engineer"],
    "azure": ["cloud engineer"],

    # AI / ML
    "machine learning": ["ml engineer"],
    "deep learning": ["ml engineer"],
    "tensorflow": ["ml engineer"],
    "pytorch": ["ml engineer"],

    # Mobile
    "flutter": ["mobile developer"],
    "react native": ["mobile developer"],
    "android": ["android developer"],
    "ios": ["ios developer"],
}

from collections import Counter

def build_roles(skills):
    role_counter = Counter()

    for skill in skills:
        skill = skill.lower()
        if skill in SKILL_TO_ROLES:
            for role in SKILL_TO_ROLES[skill]:
                role_counter[role] += 1

    return role_counter


def select_roles(role_counter, top_n=4):
    if not role_counter:
        return ["software developer"]

    sorted_roles = [r for r, _ in role_counter.most_common(top_n)]
    return sorted_roles

def build_query(roles, skills):
    role_part = " OR ".join(roles)
    skill_part = " ".join(skills)

    return f"{role_part} {skill_part}"
import requests
from bs4 import BeautifulSoup

def fetch_jobs(skills):
    print("skills:", skills)

    # normalize
    skills = [s.lower() for s in skills]

    # build roles
    role_counter = build_roles(skills)

    # select best roles
    roles = select_roles(role_counter)

    # build query
    query = build_query(roles, skills)

    print("FINAL QUERY:", query)

    # call n8n
    url = "https://adil1.app.n8n.cloud/webhook/16e37fc7-64f7-4fe8-9e1a-95ab41bbf8af"
    res = requests.post(url, json={"message": query})
    data = res.json()

    # safe extraction
    if not data:
        return []

    if isinstance(data, list):
        links = data[0]["links"]
    else:
        links = data["links"]

    jobs = []

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    # Step 2: loop links
    for link in links:
        try:
            print("going in try block")
            r = requests.get(link, headers=headers)
            soup = BeautifulSoup(r.text, "html.parser")

            title = soup.select_one("div h1")
            company = soup.select_one("div span a")
            location = soup.select_one("div span[class*='topcard__flavor topcard__flavor--bullet']")
            description = soup.select_one("div.description__text.description__text--rich")

            jobs.append({
                "link":link,
                "title": title.text.strip() if title else "",
                "company": company.text.strip() if company else "",
                "location": location.text.strip() if location else "",
                "description": description.text.strip() if description else "",

            })

        except Exception as e:
            print("Error:", e)

    
    return jobs
from collections import Counter

ROLE_KEYWORDS = {
    "Full Stack Developer": [
        "full stack", "full-stack", "mern", "mean"
    ],

    "Frontend Developer": [
        "frontend", "front-end", "react", "angular", "vue", "ui developer", "next.js"
    ],

    "Backend Developer": [
        "backend", "back-end", "django", "flask", "spring", "node", "api", "server-side"
    ],

    "Software Engineer": [
        "software engineer", "software developer", "sde", "application developer"
    ],

    "Data Scientist": [
        "data scientist", "machine learning", "ml", "deep learning", "ai", "nlp"
    ],

    "Data Engineer": [
        "data engineer", "etl", "data pipeline", "big data", "hadoop", "spark"
    ],

    "DevOps Engineer": [
        "devops", "cloud", "aws", "azure", "gcp", "kubernetes", "docker", "ci/cd"
    ],

    "Mobile Developer": [
        "android", "ios", "flutter", "react native", "mobile developer"
    ],

    "QA / Test Engineer": [
        "qa", "test engineer", "automation testing", "selenium", "testing"
    ],

    "Cybersecurity Engineer": [
        "security", "cybersecurity", "penetration", "pentest", "ethical hacking"
    ],

    "Embedded Systems Engineer": [
        "embedded", "firmware", "iot", "microcontroller"
    ],

    "Game Developer": [
        "game developer", "unity", "unreal engine"
    ],

    "UI/UX Designer": [
        "ui/ux", "ux designer", "product designer", "figma", "design"
    ]
}

def get_trending_roles(jobs):
    role_counter = Counter()

    for job in jobs:
        title = job.get("title", "").lower()

        matched = False

        for role, keywords in ROLE_KEYWORDS.items():
            for kw in keywords:
                if kw in title:
                    role_counter[role] += 1
                    matched = True
                    break
            if matched:
                break

        # fallback (important)
        if not matched:
            role_counter["Other Software Roles"] += 1

    return [
        {"role": role, "openings": count}
        for role, count in role_counter.most_common(8)
    ]

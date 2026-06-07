
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

# def fetch_jobs(query):
   
#     # normalize
#     # skills = [s.lower() for s in skills]

#     # # build roles
#     # role_counter = build_roles(skills)

#     # # select best roles
#     # roles = select_roles(role_counter)

#     # # build query
#     # query = build_query(roles, skills)


#     # call n8n
#     url = "https://adil11.app.n8n.cloud/webhook/16e37fc7-64f7-4fe8-9e1a-95ab41bbf8af"
#     res = requests.post(url, json={"message": query})


#     try:
#         data = res.json()

#     except Exception as e:
#         print("JSON PARSE ERROR:", e)
#         return []
#     # safe extraction
#     if not data:
#         return []

#     if isinstance(data, list):
#         links = data[0]["links"]
#     else:
#         links = data["links"]

#     jobs = []

#     headers = {
#         "User-Agent": "Mozilla/5.0"
#     }

#     # Step 2: loop links
#     for link in links:
#         try:
#             r = requests.get(link, headers=headers)
#             soup = BeautifulSoup(r.text, "html.parser")

#             title = soup.select_one("div h1")
#             company = soup.select_one("div span a")
#             location = soup.select_one("div span[class*='topcard__flavor topcard__flavor--bullet']")
#             description = soup.select_one("div.description__text.description__text--rich")

#             jobs.append({
#                 "link":link,
#                 "title": title.text.strip() if title else "",
#                 "company": company.text.strip() if company else "",
#                 "location": location.text.strip() if location else "",
#                 "description": description.text.strip() if description else "",

#             })

#         except Exception as e:
#             print("Error:", e)

    
#     return jobs
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


from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth
from bs4 import BeautifulSoup


def scrape_naukri(keyword):

    jobs = []

    with sync_playwright() as p:

        browser = p.chromium.launch(

            # NOW hidden
            headless=False,

            chromium_sandbox=False,

            args=[
                "--disable-blink-features=AutomationControlled",
                "--disable-dev-shm-usage",
                "--no-sandbox",
            ]
        )

        context = browser.new_context(

            viewport={"width": 1280, "height": 900},

            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/148.0.0.0 Safari/537.36"
            ),

            locale="en-US",

            java_script_enabled=True,
        )

        page = context.new_page()

        # stealth mode
        stealth = Stealth()

        stealth.apply_stealth_sync(page)

        # extra webdriver hiding
        page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
        """)

        page.goto(
            f"https://www.naukri.com/{keyword}-jobs-in-india",
            wait_until="domcontentloaded",
            timeout=60000
        )

        # allow jobs to load
        page.wait_for_timeout(5000)

        # small human-like scroll
        page.evaluate("""
            window.scrollTo(0, document.body.scrollHeight / 2)
        """)

        page.wait_for_timeout(2000)

        html = page.content()

        soup = BeautifulSoup(html, "html.parser")

        cards = soup.select("div.srp-jobtuple-wrapper")

        for card in cards:

            title_el = card.select_one("a.title")

            company_el = card.select_one(".comp-name")

            location_el = card.select_one(".locWdth")

            experience_el = card.select_one(".expwdth")

            description_el = card.select_one(".job-desc")

            # posted date
            posted_el = card.select_one(".job-post-day")

            posted_text = (
                posted_el.get_text(strip=True).lower()
                if posted_el else ""
            )

            # keep only recent jobs
            if not (
                "today" in posted_text
                or "1 day" in posted_text
                or "24" in posted_text
                or "few hours" in posted_text
                or "just" in posted_text
            ):
                continue

            jobs.append({

                "title":
                    title_el.get_text(strip=True)
                    if title_el else "",

                "link":
                    title_el.get("href")
                    if title_el else "",

                "company":
                    company_el.get_text(strip=True)
                    if company_el else "",

                "location":
                    location_el.get_text(strip=True)
                    if location_el else "",

                "experience":
                    experience_el.get_text(strip=True)
                    if experience_el else "",

                "description":
                    description_el.get_text(strip=True)
                    if description_el else "",

                "posted":
                    posted_text,
            })

        browser.close()
    return jobs

def scrape_linkedin(keyword):

    jobs = []

    with sync_playwright() as p:

        browser = p.chromium.launch(

            headless=True,

            args=[
                "--disable-blink-features=AutomationControlled",
                "--disable-dev-shm-usage",
                "--no-sandbox",
            ]
        )

        context = browser.new_context(

            viewport={"width": 1280, "height": 900},

            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/148.0.0.0 Safari/537.36"
            )
        )

        page = context.new_page()

        # hide webdriver
        page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
        """)
        url = f"https://www.linkedin.com/jobs/search/?keywords={keyword}&f_TPR=r86400"
        # last 24h jobs
        try:
            page.goto(
                url,
                wait_until="domcontentloaded",
                timeout=30000
            )
        except Exception as e:
            print("LinkedIn load error:", e)
            browser.close()
            return []
        page.wait_for_timeout(5000)

        html = page.content()

        soup = BeautifulSoup(html, "html.parser")

        cards = soup.select(
            "ul.jobs-search__results-list li"
        )

        # limit to first 10 jobs for speed
        cards = cards[:10]

        for card in cards:

            title_el = card.select_one("h3")

            company_el = card.select_one("h4")

            link_el = card.select_one(
                "a.base-card__full-link"
            )

            location_el = card.select_one(
                ".job-search-card__location"
            )

            posted_el = card.select_one("time")

            posted_text = (
                posted_el.get_text(strip=True)
                if posted_el else ""
            )

            job_link = (
                link_el.get("href")
                if link_el else ""
            )

            description = ""

            # fetch detail page description
            if job_link:

                try:

                    detail_page = context.new_page()

                    detail_page.goto(
                        job_link,
                        wait_until="domcontentloaded",
                        timeout=30000
                    )

                    detail_page.wait_for_timeout(2000)

                    detail_html = detail_page.content()

                    detail_soup = BeautifulSoup(
                        detail_html,
                        "html.parser"
                    )

                    desc_el = detail_soup.select_one(
                        ".show-more-less-html__markup"
                    )

                    if desc_el:

                        description = desc_el.get_text(
                            " ",
                            strip=True
                        )

                    detail_page.close()

                except Exception as e:
                    print("Description error:", e)

            jobs.append({

                "title":
                    title_el.get_text(strip=True)
                    if title_el else "",

                "company":
                    company_el.get_text(strip=True)
                    if company_el else "",

                "link":
                    job_link,

                "location":
                    location_el.get_text(strip=True)
                    if location_el else "",

                "description":
                    description,

                "posted":
                    posted_text,
            })

        browser.close()

    return jobs
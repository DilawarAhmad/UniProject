import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("RAPIDAPI_KEY")

HEADERS = {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
}

JSEARCH_URL = "https://jsearch.p.rapidapi.com/search"


def fetch_jsearch_jobs(domains):
    jobs = []

    domain_queries = {
        "frontend": "frontend developer react javascript",
        "backend": "backend developer django node",
        "fullstack": "full stack developer",
        "data": "data scientist python",
        "ai": "machine learning engineer ai",
        "cloud": "cloud engineer aws devops",
        "mobile": "mobile developer android ios",
        "general": "software developer"
    }

    for domain in domains:
        query = domain_queries.get(domain, "software developer")

        params = {
            "query": query,
            "page": "1",
            "num_pages": "1"
        }

        try:
            res = requests.get(JSEARCH_URL, headers=HEADERS, params=params)

            if res.status_code != 200:
                continue

            data = res.json()

            for job in data.get("data", []):
                jobs.append({
                    "title": job.get("job_title"),
                    "company": job.get("employer_name"),
                    "location": job.get("job_city"),
                    "type": job.get("job_employment_type"),
                    "link": job.get("job_apply_link"),
                    "description": job.get("job_description"),
                    "domain": domain
                })

        except:
            continue
    print("jobs from rapid",jobs)
    return jobs


def fetch_arbeitnow_jobs():
    url = "https://www.arbeitnow.com/api/job-board-api"

    jobs = []

    try:
        res = requests.get(url)

        if res.status_code != 200:
            return []

        data = res.json()

        for job in data.get("data", []):
            jobs.append({
            "title": job.get("title"),
            "company": job.get("company_name"),
            "location": job.get("location"),
            "type": "remote",
            "link": job.get("url"),
            "description": job.get("description"),
            "source": "arbeitnow",
            "domain": "general"   # 🔥 ADD THIS
        })

    except:
        return []

    return jobs
import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("RAPIDAPI_KEY")

URL = "https://jsearch.p.rapidapi.com/search"

HEADERS = {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
}


def fetch_jobs(skills, limit=15):

    print("SERVICE STARTED")
    print("skills received:", skills)
    print("api key:", API_KEY)

    query = " OR ".join([f"{s} developer" for s in skills])

    params = {
        "query": query,
        "page": "1",
        "num_pages": "1"
    }

    print("query:", query)

    res = requests.get(URL, headers=HEADERS, params=params)

    print("status:", res.status_code)

    if res.status_code != 200:
        print("error response:", res.text)
        return []

    data = res.json()

    jobs_data = data.get("data", [])

    print("jobs returned from api:", len(jobs_data))

    jobs = []

    for job in jobs_data:

        jobs.append({
            "title": job.get("job_title"),
            "company": job.get("employer_name"),
            "location": job.get("job_city"),
            "type": job.get("job_employment_type"),
            "link": job.get("job_apply_link"),
            "description": job.get("job_description")
        })

        if len(jobs) >= limit:
            break

    print("final jobs:", len(jobs))

    return jobs
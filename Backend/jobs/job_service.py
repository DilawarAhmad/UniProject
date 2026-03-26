from .job_sources import fetch_jsearch_jobs, fetch_arbeitnow_jobs


def fetch_all_jobs(skills):
    jobs1 = fetch_jsearch_jobs(skills)
    jobs2 = fetch_arbeitnow_jobs()

    all_jobs = jobs1 + jobs2

    # remove duplicates
    unique = {}
    for job in all_jobs:
        link = job.get("link")
        if link and link not in unique:
            unique[link] = job

    return list(unique.values())
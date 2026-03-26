def score_job(job, skills):
    score = 0

    title = (job.get("title") or "").lower()
    desc = (job.get("description") or "").lower()

    for skill in skills:
        if skill in title:
            score += 5   # stronger weight
        if skill in desc:
            score += 3

    # bonus scoring
    if "senior" in title:
        score += 1
    if "intern" in title:
        score += 2
    if "remote" in desc:
        score += 1

    return score


def rank_jobs(jobs, skills):
    for job in jobs:
        job["score"] = score_job(job, skills)

    return sorted(jobs, key=lambda x: x["score"], reverse=True)


# 🔥 NEW → diversify results (VERY IMPORTANT)
def diversify_jobs(jobs, limit=10):
    role_buckets = {}

    for job in jobs:
        title = (job.get("title") or "").lower()

        if "frontend" in title:
            role = "frontend"
        elif "backend" in title:
            role = "backend"
        elif "full" in title:
            role = "fullstack"
        elif "data" in title:
            role = "data"
        elif "ai" in title:
            role = "ai"
        else:
            role = "other"

        if role not in role_buckets:
            role_buckets[role] = []

        role_buckets[role].append(job)

    diversified = []

    while len(diversified) < limit:
        for role in role_buckets:
            if role_buckets[role]:
                diversified.append(role_buckets[role].pop(0))

                if len(diversified) >= limit:
                    break

        if all(len(v) == 0 for v in role_buckets.values()):
            break

    return diversified
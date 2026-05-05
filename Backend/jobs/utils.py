CORE_SKILLS = {
    # Frontend frameworks
    "react", "react.js", "next.js", "vue", "angular", "svelte",

    # Backend / languages
    "python", "java", "node", "golang", "go", "php", "ruby",

    # Backend frameworks
    "django", "flask", "fastapi", "spring", "spring boot", "express", "rails", "laravel",

    # Mobile
    "flutter", "react native", "android", "ios", "swift", "kotlin",

    # AI / ML
    "machine learning", "deep learning", "nlp", "tensorflow", "pytorch",

    # Systems
    "c", "c++", "rust"
}


SUPPORTING_SKILLS = {
    # Frontend basics
    "javascript", "typescript", "html", "css", "tailwind",

    # Databases
    "mysql", "postgresql", "mongodb", "redis", "sqlite", "sql",

    # DevOps
    "docker", "kubernetes", "aws", "azure", "gcp", "terraform"
}


SECONDARY_SKILLS = {
    "git", "github", "gitlab", "bitbucket",
    "postman", "swagger",
    "linux", "bash", "jira", "figma"
}


IGNORE = {
    "communication", "leadership", "teamwork",
    "problem solving", "critical thinking",
    "windows", "mac os", "microsoft office"
}

def normalize_skill(name):
    name = name.lower().strip()

    if "+" in name:
        name = name.replace("+", "plus")

    # normalize common variations
    if "react" in name:
        return "react"
    if "node" in name:
        return "node"
    if "tailwind" in name:
        return "tailwind"
    if "javascript" in name:
        return "javascript"

    return name


def get_skill_names(skills):
    core = []
    supporting = []
    secondary = []

    for s in skills:
        name = normalize_skill(s.name)

        if name in IGNORE:
            continue

        if name in CORE_SKILLS:
            core.append(name)
        elif name in SUPPORTING_SKILLS:
            supporting.append(name)
        elif name in SECONDARY_SKILLS:
            secondary.append(name)

    # 🔥 PRIORITY LOGIC

    # Step 1: always prefer core skills
    final = core

    # Step 2: if too few core, add supporting
    if len(final) < 3:
        final += supporting

    # Step 3: if still empty, fallback
    if not final:
        final = [normalize_skill(s.name) for s in skills]

    # remove duplicates (preserve order)
    final = list(dict.fromkeys(final))

    return final[:5]
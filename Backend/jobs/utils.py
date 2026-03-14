def get_skill_names(skills):

    ignore = [
        "communication",
        "leadership",
        "problem solving",
        "windows",
        "mac os",
        "microsoft office"
    ]

    clean_skills = []

    for s in skills:

        name = s.name.lower()

        if name in ignore:
            continue

        if "+" in name:
            name = name.replace("+", "plus")

        clean_skills.append(name)

    
    return clean_skills[:6]
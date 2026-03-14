import spacy
import re

nlp = spacy.load("en_core_web_sm")

SKILL_DATABASE = [
    "python", "java", "javascript", "react", "node.js", "angular", "vue",
    "html", "css", "sql", "mysql", "postgresql", "mongodb",
    "django", "flask", "spring", "machine learning", "deep learning",
    "data analysis", "data science", "excel", "tableau", "pandas", "numpy",
    "git", "aws", "azure", "docker", "kubernetes", "nlp", "c++", "c#",
    "project management", "communication", "leadership", "problem solving",
    "rest api", "graphql", "firebase", "devops", "linux", "bash",
    "matlab", "php", "scheme", "microsoft office", "photoshop",
    "dreamweaver", "3ds max", "windows", "mac os", "time management"
]


def normalize(text):
    """Clean and lowercase text."""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s\+\#\.\-]', ' ', text)
    return text


def extract_skills(text):
    """
    Extracts realistic skills by exact match + NLP phrase scan.
    Uses regex word boundaries to avoid substring issues (like 'sql' in 'sequel').
    """
    try:
        text = normalize(text)
        found_skills = set()
        doc = nlp(text)

        for skill in SKILL_DATABASE:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text):
                found_skills.add(skill)

        for ent in doc.ents:
            phrase = ent.text.lower().strip()
            if phrase in SKILL_DATABASE:
                found_skills.add(phrase)

        print(f"🧠 Extracted {len(found_skills)} skills:", found_skills)
        return sorted(list(found_skills))

    except Exception as e:
        print("⚠️ Error in skill extraction:", e)
        return []

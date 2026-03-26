import spacy
import re

nlp = spacy.load("en_core_web_sm")

SKILL_DATABASE = [

    # Programming Languages
    "python","java","c","c++","c#","javascript","typescript","go","rust","kotlin",
    "swift","php","ruby","scala","r","matlab","dart",

    # Web Development
    "html","css","sass","bootstrap","tailwind css",
    "react","react.js","next.js","vue","angular","svelte",
    "node.js","express","express.js","django","flask","fastapi",
    "spring","spring boot","asp.net",

    # Databases
    "sql","mysql","postgresql","sqlite","oracle",
    "mongodb","firebase","dynamodb","redis","cassandra",

    # Data Science / AI
    "machine learning","deep learning","artificial intelligence",
    "data science","data analysis","nlp","computer vision",
    "pandas","numpy","scikit-learn","tensorflow","keras","pytorch",
    "xgboost","lightgbm","matplotlib","seaborn",

    # DevOps / Cloud
    "aws","amazon web services","azure","google cloud","gcp",
    "docker","kubernetes","jenkins","ci/cd","terraform","ansible",
    "nginx","apache",

    # Tools
    "git","github","gitlab","bitbucket","jira","postman","swagger",
    "linux","bash","shell scripting",

    # Mobile Development
    "android","ios","react native","flutter","xamarin",

    # APIs
    "rest api","graphql","soap","api development",

    # Cybersecurity
    "network security","ethical hacking","penetration testing",
    "cryptography","owasp",

    # Big Data
    "hadoop","spark","kafka","hive",

    # Testing
    "unit testing","integration testing","selenium","pytest","jest",

    # Design
    "figma","adobe xd","photoshop","illustrator",
    "ui design","ux design","wireframing","prototyping",

    # Analytics / Business
    "excel","power bi","tableau","google analytics",

    # OS
    "windows","macos","linux",

    # Core CS
    "data structures","algorithms","oop","object oriented programming",
    "system design","microservices",

    # Methodologies
    "agile","scrum","devops",

    # Soft Skills
    "communication","leadership","teamwork","problem solving",
    "critical thinking","time management","adaptability",
    "project management","decision making"
]


def normalize(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s\+\#\.\-]', ' ', text)
    return text


def extract_skills(text):
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
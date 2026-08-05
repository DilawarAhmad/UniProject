# validators.py

CS_KEYWORDS = {

    # Programming Languages
    "python", "java", "c", "c++", "c#", "javascript", "typescript",
    "go", "golang", "rust", "kotlin", "swift", "php", "ruby",
    "scala", "perl", "r", "matlab", "dart",

    # Frontend
    "html", "css", "sass", "bootstrap", "tailwind", "tailwind css",
    "javascript", "typescript", "react", "nextjs", "next.js",
    "angular", "vue", "svelte", "jquery",

    # Backend
    "node", "nodejs", "node.js", "express", "nestjs",
    "django", "flask", "fastapi", "spring", "spring boot",
    "laravel", "asp.net", ".net", "ruby on rails",

    # Full Stack
    "mern", "mern stack",
    "mean", "mean stack",
    "mevn", "mevn stack",
    "lamp", "full stack",
    "full stack developer",
    "frontend developer",
    "backend developer",

    # Mobile Development
    "android", "ios",
    "flutter", "react native",
    "xamarin", "ionic",

    # Databases
    "sql", "mysql", "postgresql", "postgres",
    "mongodb", "sqlite", "oracle",
    "redis", "firebase", "supabase",
    "cassandra", "dynamodb",

    # Data Science
    "data science", "data scientist",
    "numpy", "pandas",
    "matplotlib", "seaborn",
    "scikit-learn", "sklearn",
    "jupyter", "anaconda",

    # Artificial Intelligence
    "ai", "artificial intelligence",
    "machine learning",
    "deep learning",
    "neural networks",
    "computer vision",
    "nlp",
    "generative ai",
    "llm",
    "large language model",
    "transformers",
    "huggingface",
    "langchain",
    "langgraph",
    "ollama",
    "mistral",
    "llama",
    "gpt",
    "bert",

    # DevOps & Cloud
    "docker",
    "kubernetes",
    "jenkins",
    "terraform",
    "ansible",
    "github actions",
    "ci/cd",
    "devops",
    "aws",
    "azure",
    "gcp",
    "cloud computing",

    # Cyber Security
    "cybersecurity",
    "cyber security",
    "ethical hacking",
    "penetration testing",
    "bug bounty",
    "network security",
    "security analyst",

    # Networking
    "computer networks",
    "networking",
    "ccna",
    "ccnp",

    # Operating Systems
    "operating system",
    "linux",
    "ubuntu",
    "unix",

    # Software Engineering
    "software engineering",
    "software developer",
    "software engineer",
    "system design",
    "design patterns",
    "microservices",
    "api",
    "rest api",
    "graphql",

    # DSA
    "data structures",
    "algorithms",
    "dsa",
    "competitive programming",
    "leetcode",

    # Testing
    "testing",
    "unit testing",
    "pytest",
    "jest",
    "selenium",
    "cypress",

    # Version Control
    "git",
    "github",
    "gitlab",
    "bitbucket",

    # Career Roles
    "web developer",
    "frontend engineer",
    "backend engineer",
    "full stack engineer",
    "data engineer",
    "data analyst",
    "data scientist",
    "ml engineer",
    "ai engineer",
    "devops engineer",
    "cloud engineer",
    "security engineer",
    "software architect",
    "blockchain developer",
    "game developer",
    "android developer",
    "ios developer",

    # Other Technologies
    "blockchain",
    "web3",
    "ethereum",
    "solidity",
    "unity",
    "unreal engine",
    "embedded systems",
    "internet of things",
    "iot",
    "raspberry pi",
    "arduino"
}
import re

def is_computer_science_query(query):
    query = query.lower().strip()

    for keyword in CS_KEYWORDS:
        pattern = r"\b" + re.escape(keyword.lower()) + r"\b"

        if re.search(pattern, query):
            print(f"Matched keyword: {keyword}")  # Optional for debugging
            return True

    return False
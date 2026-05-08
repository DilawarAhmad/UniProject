# cleaner_agent.py

import re


def clean_output(text):

    lines = text.split("\n")

    steps = []

    seen = set()

    for line in lines:

        line = line.strip()

        if (
            "Instruction" in line or
            "User" in line or
            line.lower().startswith("generate")
        ):
            break

        match = re.match(r'^(\d+)\.\s*(.*)', line)

        if not match:
            continue

        content = match.group(2).strip()

        content = content.split("Instruction")[0].strip()

        content = re.sub(r'\s+', ' ', content)

        if len(content) < 5:
            continue

        if content in seen:
            continue

        seen.add(content)

        steps.append(content)

    final_steps = []

    for step in steps:

        if step in final_steps:
            break

        final_steps.append(step)

    result = []

    for i, step in enumerate(final_steps[:20], 1):

        result.append(f"{i}. {step}")

    return "\n".join(result)


# ============================================
# CLEANER AGENT
# ============================================

def cleaner_agent(state):

    raw_output = state["raw_output"]

    cleaned = clean_output(raw_output)

    if not cleaned or len(cleaned.split("\n")) < 3:

        cleaned = (
            "1. Start with fundamentals\n"
            "2. Practice core concepts\n"
            "3. Build projects\n"
            "4. Learn advanced concepts\n"
            "5. Build production applications"
        )

    return {

        "cleaned_roadmap": cleaned
    }
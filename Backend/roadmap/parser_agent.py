# parser_agent.py

import re


def parser_agent(state):

    roadmap = state["enhanced_roadmap"]

    lines = roadmap.split("\n")

    parsed_steps = []

    for line in lines:

        line = line.strip()

        match = re.match(r'^\d+\.\s*(.*)', line)

        if match:

            step = match.group(1).strip()

            if len(step) > 5:

                parsed_steps.append(step)

    return {

        "parsed_steps": parsed_steps
    }
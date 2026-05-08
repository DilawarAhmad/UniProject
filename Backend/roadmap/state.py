# state.py

from typing import TypedDict


class RoadmapState(TypedDict):

    query: str

    raw_output: str

    cleaned_roadmap: str

    enhanced_roadmap: str

    parsed_steps: list

    resources: list

    final_output: dict
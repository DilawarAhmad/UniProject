# enhancement_agent.py

from .agent import agentFun


def enhancement_agent(state):

    final_roadmap = agentFun(

        state["query"],

        state["cleaned_roadmap"]
    )

    if not final_roadmap:

        final_roadmap = state["cleaned_roadmap"]

    return {

        "enhanced_roadmap": final_roadmap
    }
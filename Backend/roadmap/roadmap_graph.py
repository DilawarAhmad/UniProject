# roadmap_graph.py

from langgraph.graph import StateGraph, END

from .state import RoadmapState

from .roadmap_generator_agent import roadmap_generator_agent

from .cleaner_agent import cleaner_agent

from .enhancement_agent import enhancement_agent


builder = StateGraph(RoadmapState)


# ============================================
# NODES
# ============================================

builder.add_node(
    "roadmap_generator",
    roadmap_generator_agent
)

builder.add_node(
    "cleaner_agent",
    cleaner_agent
)

builder.add_node(
    "enhancement_agent",
    enhancement_agent
)


# ============================================
# FLOW
# ============================================

builder.set_entry_point(
    "roadmap_generator"
)

builder.add_edge(
    "roadmap_generator",
    "cleaner_agent"
)

builder.add_edge(
    "cleaner_agent",
    "enhancement_agent"
)

builder.add_edge(
    "enhancement_agent",
    END
)


roadmap_graph = builder.compile()
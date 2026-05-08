# graph.py

from langgraph.graph import StateGraph, END

from .state import RoadmapState

from .roadmap_generator_agent import roadmap_generator_agent

from .cleaner_agent import cleaner_agent

from .enhancement_agent import enhancement_agent

from .parser_agent import parser_agent

from .resource_agent import resource_agent

from .formatter_agent import formatter_agent


builder = StateGraph(RoadmapState)


# ============================================
# ADD AGENTS
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

builder.add_node(
    "parser_agent",
    parser_agent
)

builder.add_node(
    "resource_agent",
    resource_agent
)

builder.add_node(
    "formatter_agent",
    formatter_agent
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
    "parser_agent"
)

builder.add_edge(
    "parser_agent",
    "resource_agent"
)

builder.add_edge(
    "resource_agent",
    "formatter_agent"
)

builder.add_edge(
    "formatter_agent",
    END
)


roadmap_graph = builder.compile()
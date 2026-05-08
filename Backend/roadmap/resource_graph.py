# resource_graph.py

from langgraph.graph import StateGraph, END

from .state import RoadmapState

from .parser_agent import parser_agent

from .resource_agent import resource_agent

from .formatter_agent import formatter_agent


builder = StateGraph(RoadmapState)


# ============================================
# NODES
# ============================================

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


resource_graph = builder.compile()
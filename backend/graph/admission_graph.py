from langgraph.graph import StateGraph, START, END
from langgraph.graph.state import CompiledStateGraph

from backend.graph.state import State
from backend.graph.nodes import (
    intent_router_node,
    academic_kb_node,
    fee_kb_node,
    general_ai_node,
    response_generator_node,
)
from backend.graph.router import route_query


def build_admission_graph() -> CompiledStateGraph:
    graph = StateGraph(State)

    graph.add_node("intent_router", intent_router_node)
    graph.add_node("academic_kb", academic_kb_node)
    graph.add_node("fee_kb", fee_kb_node)
    graph.add_node("general_ai", general_ai_node)
    graph.add_node("response_generator", response_generator_node)

    graph.add_edge(START, "intent_router")
    graph.add_conditional_edges("intent_router", route_query)

    graph.add_edge("academic_kb", "response_generator")
    graph.add_edge("fee_kb", "response_generator")
    graph.add_edge("general_ai", "response_generator")

    graph.add_edge("response_generator", END)

    return graph.compile()


admission_graph: CompiledStateGraph = build_admission_graph()

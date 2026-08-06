import operator
from typing import TypedDict, Annotated, List, Dict, Any
from langgraph.graph.message import add_messages


class State(TypedDict):
    programme: str
    messages: Annotated[list, add_messages]
    query_type: str
    retrieved_context: str
    retrieved_sources: List[Dict[str, Any]]
    debug_logs: Annotated[List[Dict[str, Any]], operator.add]

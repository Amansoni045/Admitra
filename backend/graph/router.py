from backend.graph.state import State


def route_query(state: State) -> str:
    query_type = state.get("query_type", "general")

    if query_type == "academic":
        return "academic_kb"
    elif query_type == "fee":
        return "fee_kb"
    else:
        return "general_ai"

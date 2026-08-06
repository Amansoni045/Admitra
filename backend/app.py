from typing import Dict, Any, List
from backend.graph.admission_graph import admission_graph
from backend.config.settings import GROQ_MODEL_NAME, EMBEDDING_MODEL_NAME


def chat(programme: str, message: str, developer_mode: bool = False) -> Dict[str, Any]:
    initial_state: Dict[str, Any] = {
        "programme": programme,
        "messages": [("human", message)],
        "retrieved_sources": [],
        "debug_logs": []
    }

    result = admission_graph.invoke(initial_state)

    last_message = result["messages"][-1] if result.get("messages") else None
    answer_text = getattr(last_message, "content", str(last_message)) if last_message else ""

    if not developer_mode:
        return {"answer": answer_text}

    debug_logs: List[Dict[str, Any]] = result.get("debug_logs", [])
    retrieved_sources: List[Dict[str, Any]] = result.get("retrieved_sources", [])
    query_type: str = result.get("query_type", "general")

    node_execution_order: List[str] = [log["node_name"] for log in debug_logs]
    latency_per_node: Dict[str, float] = {log["node_name"]: log["latency_ms"] for log in debug_logs}
    total_latency_ms: float = round(sum(log["latency_ms"] for log in debug_logs), 2)

    retrieved_page_numbers: List[int] = sorted(list(set(src["page"] for src in retrieved_sources if "page" in src)))
    similarity_scores: List[float] = [src["similarity_score"] for src in retrieved_sources if "similarity_score" in src]

    fallback_decisions: List[str] = []
    if query_type == "general":
        fallback_decisions.append("Query classified as general; bypassed PDF vector store retrieval.")

    diagnostics = {
        "workflow_timeline": debug_logs,
        "node_execution_order": node_execution_order,
        "routing_decision": query_type,
        "retrieved_documents": retrieved_sources,
        "retrieved_page_numbers": retrieved_page_numbers,
        "similarity_scores": similarity_scores,
        "latency_per_node": latency_per_node,
        "total_latency_ms": total_latency_ms,
        "llm_model_used": GROQ_MODEL_NAME,
        "embedding_model_used": EMBEDDING_MODEL_NAME,
        "fallback_decisions": fallback_decisions
    }

    return {
        "answer": answer_text,
        "query_type": query_type,
        "diagnostics": diagnostics
    }

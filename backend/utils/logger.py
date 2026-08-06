import time
from datetime import datetime, timezone
from typing import TypedDict, Optional


class NodeLogEntry(TypedDict):
    node_name: str
    timestamp: str
    latency_ms: float
    routing_decision: Optional[str]
    retrieved_chunk_count: int


def create_node_log(
    node_name: str,
    start_time: float,
    routing_decision: Optional[str] = None,
    retrieved_chunk_count: int = 0
) -> NodeLogEntry:
    latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
    timestamp = datetime.now(timezone.utc).isoformat()

    return {
        "node_name": node_name,
        "timestamp": timestamp,
        "latency_ms": latency_ms,
        "routing_decision": routing_decision,
        "retrieved_chunk_count": retrieved_chunk_count
    }

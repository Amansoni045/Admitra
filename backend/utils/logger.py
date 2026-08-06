import time
import logging
from datetime import datetime, timezone
from typing import TypedDict, Optional

# Configure standard root logger for Admitra backend
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

logger = logging.getLogger("admitra.nodes")


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
    retrieved_chunk_count: int = 0,
) -> NodeLogEntry:
    latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
    timestamp = datetime.now(timezone.utc).isoformat()

    log_entry: NodeLogEntry = {
        "node_name": node_name,
        "timestamp": timestamp,
        "latency_ms": latency_ms,
        "routing_decision": routing_decision,
        "retrieved_chunk_count": retrieved_chunk_count,
    }

    logger.info(
        f"Node Executed: {node_name} | Latency: {latency_ms}ms | Chunks: {retrieved_chunk_count}"
    )
    return log_entry

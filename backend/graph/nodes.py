import time
from typing import Dict, Any, List

from backend.graph.state import State
from backend.llm.groq_client import llm
from backend.rag.retriever import academic_retriever, fee_retriever
from backend.utils.logger import create_node_log


def intent_router_node(state: State) -> Dict[str, Any]:
    start_time = time.perf_counter()
    last_message = state["messages"][-1].content

    prompt = (
        "Classify the following student query into exactly one category: "
        "'academic', 'fee', or 'general'.\n\n"
        "Use 'academic' for questions about attendance, exams, grading, credits, "
        "promotion, course structure, summer training, or degree requirements.\n"
        "Use 'fee' for questions about tuition, payment, refund, late charges, "
        "scholarships, or any money-related topic.\n"
        "Use 'general' for greetings, casual talk, or anything not related to "
        "the college rules or fee.\n\n"
        f"Query: {last_message}\n\n"
        "Return only one word: academic, fee, or general."
    )

    response = llm.invoke(prompt)
    category = str(response.content).strip().lower()

    if "academic" in category:
        category = "academic"
    elif "fee" in category:
        category = "fee"
    else:
        category = "general"

    log_entry = create_node_log(
        node_name="intent_router",
        start_time=start_time,
        routing_decision=category,
        retrieved_chunk_count=0
    )

    return {
        "query_type": category,
        "debug_logs": [log_entry]
    }


def academic_kb_node(state: State) -> Dict[str, Any]:
    start_time = time.perf_counter()
    query = state["messages"][-1].content
    docs_and_scores = academic_retriever.similarity_search_with_score(query)

    context = "\n\n".join([doc.page_content for doc, _ in docs_and_scores])
    sources = [
        {
            "content": doc.page_content,
            "source": doc.metadata.get("source", "academics_handbook.pdf"),
            "page": doc.metadata.get("page", 0) + 1,
            "similarity_score": round(float(score), 4)
        }
        for doc, score in docs_and_scores
    ]

    log_entry = create_node_log(
        node_name="academic_kb",
        start_time=start_time,
        routing_decision=None,
        retrieved_chunk_count=len(docs_and_scores)
    )

    return {
        "retrieved_context": context,
        "retrieved_sources": sources,
        "debug_logs": [log_entry]
    }


def fee_kb_node(state: State) -> Dict[str, Any]:
    start_time = time.perf_counter()
    query = state["messages"][-1].content
    docs_and_scores = fee_retriever.similarity_search_with_score(query)

    context = "\n\n".join([doc.page_content for doc, _ in docs_and_scores])
    sources = [
        {
            "content": doc.page_content,
            "source": doc.metadata.get("source", "fee_structure.pdf"),
            "page": doc.metadata.get("page", 0) + 1,
            "similarity_score": round(float(score), 4)
        }
        for doc, score in docs_and_scores
    ]

    log_entry = create_node_log(
        node_name="fee_kb",
        start_time=start_time,
        routing_decision=None,
        retrieved_chunk_count=len(docs_and_scores)
    )

    return {
        "retrieved_context": context,
        "retrieved_sources": sources,
        "debug_logs": [log_entry]
    }


def general_ai_node(state: State) -> Dict[str, Any]:
    start_time = time.perf_counter()

    log_entry = create_node_log(
        node_name="general_ai",
        start_time=start_time,
        routing_decision=None,
        retrieved_chunk_count=0
    )

    return {
        "retrieved_context": "NO_RETRIEVAL_NEEDED",
        "retrieved_sources": [],
        "debug_logs": [log_entry]
    }


def response_generator_node(state: State) -> Dict[str, Any]:
    start_time = time.perf_counter()

    query = state["messages"][-1].content
    programme = state.get("programme", "Unknown")
    context = state.get("retrieved_context", "NO_RETRIEVAL_NEEDED")

    if context == "NO_RETRIEVAL_NEEDED":
        prompt = (
            f"You are a friendly college assistant talking to a {programme} student. "
            f"Answer this question using your own general knowledge:\n\n{query}"
        )
    else:
        prompt = (
            f"You are a college assistant helping a {programme} student. "
            f"Use the following context from the official college documents to answer "
            f"the question accurately. If the context mentions specific figures for "
            f"different programmes, highlight the one relevant to {programme} if possible.\n\n"
            f"Context:\n{context}\n\n"
            f"Question: {query}\n\n"
            f"Give a clear, friendly, and precise answer."
        )

    response = llm.invoke(prompt)
    answer_content = str(response.content).strip()

    log_entry = create_node_log(
        node_name="response_generator",
        start_time=start_time,
        routing_decision=None,
        retrieved_chunk_count=0
    )

    return {
        "messages": [("ai", answer_content)],
        "debug_logs": [log_entry]
    }

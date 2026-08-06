"""RAG package for Admitra backend."""
from backend.rag.embeddings import embeddings, get_embeddings
from backend.rag.vectorstore import build_vectorstore_from_pdf
from backend.rag.retriever import academic_retriever, fee_retriever, build_retriever, LazyRetriever

__all__ = [
    "embeddings",
    "get_embeddings",
    "build_vectorstore_from_pdf",
    "academic_retriever",
    "fee_retriever",
    "build_retriever",
    "LazyRetriever",
]

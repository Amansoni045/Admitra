"""Configuration package for Admitra backend."""
from backend.config.settings import (
    ACADEMICS_PDF_PATH,
    FEE_STRUCTURE_PDF_PATH,
    GROQ_MODEL_NAME,
    LLM_TEMPERATURE,
    EMBEDDING_MODEL_NAME,
    CHUNK_SIZE,
    CHUNK_OVERLAP,
    RETRIEVAL_K,
)

__all__ = [
    "ACADEMICS_PDF_PATH",
    "FEE_STRUCTURE_PDF_PATH",
    "GROQ_MODEL_NAME",
    "LLM_TEMPERATURE",
    "EMBEDDING_MODEL_NAME",
    "CHUNK_SIZE",
    "CHUNK_OVERLAP",
    "RETRIEVAL_K",
]

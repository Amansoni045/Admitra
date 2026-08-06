import os
import threading
import logging
from pathlib import Path
from typing import Optional, Dict

from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq

from backend.config.settings import (
    GROQ_API_KEY,
    GROQ_MODEL_NAME,
    LLM_TEMPERATURE,
    ACADEMICS_PDF_PATH,
    FEE_STRUCTURE_PDF_PATH,
)

logger = logging.getLogger("admitra.resource_manager")

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
INDEXES_DIR = ROOT_DIR / "backend" / "indexes"
ACADEMIC_INDEX_DIR = INDEXES_DIR / "academic_index"
FEE_INDEX_DIR = INDEXES_DIR / "fee_index"


class ResourceManager:
    """
    Thread-safe Singleton Manager for system-wide heavy resources.
    Guarantees that LLM instances, embedding models, and FAISS vectorstores
    are loaded once, re-used globally, and never duplicated in memory.
    """

    def __init__(self):
        self._lock = threading.Lock()
        self._llm: Optional[ChatGroq] = None
        self._embeddings = None
        self._vectorstores: Dict[str, FAISS] = {}

    def get_llm(self) -> ChatGroq:
        if self._llm is None:
            with self._lock:
                if self._llm is None:
                    api_key = GROQ_API_KEY or os.environ.get("GROQ_API_KEY", "")
                    if not api_key:
                        logger.warning(
                            "GROQ_API_KEY missing. Initializing fallback Groq LLM."
                        )
                    logger.info("Initializing Singleton Groq LLM Client...")
                    self._llm = ChatGroq(
                        groq_api_key=api_key or "gsk_placeholder",
                        model_name=GROQ_MODEL_NAME,
                        temperature=LLM_TEMPERATURE,
                    )
        return self._llm

    def get_embeddings(self):
        if self._embeddings is None:
            with self._lock:
                if self._embeddings is None:
                    logger.info("Initializing Singleton FastEmbed Embeddings Engine...")
                    from backend.rag.embeddings import get_embeddings
                    self._embeddings = get_embeddings()
        return self._embeddings

    def get_vectorstore(self, key: str, pdf_path: str, index_dir: Path) -> FAISS:
        if key not in self._vectorstores:
            with self._lock:
                if key not in self._vectorstores:
                    embeddings = self.get_embeddings()

                    # 1. Prefer loading pre-computed offline FAISS index from disk
                    if index_dir.exists() and (index_dir / "index.faiss").exists():
                        logger.info(f"Loading pre-computed FAISS index from: {index_dir}")
                        self._vectorstores[key] = FAISS.load_local(
                            str(index_dir),
                            embeddings,
                            allow_dangerous_deserialization=True,
                        )
                    else:
                        # 2. Fallback: Build index from PDF if pre-computed index missing
                        logger.info(
                            f"Pre-computed index not found at {index_dir}. Building from PDF..."
                        )
                        from backend.rag.vectorstore import build_vectorstore_from_pdf
                        self._vectorstores[key] = build_vectorstore_from_pdf(pdf_path)

        return self._vectorstores[key]

    def get_academic_vectorstore(self) -> FAISS:
        return self.get_vectorstore("academic", ACADEMICS_PDF_PATH, ACADEMIC_INDEX_DIR)

    def get_fee_vectorstore(self) -> FAISS:
        return self.get_vectorstore("fee", FEE_STRUCTURE_PDF_PATH, FEE_INDEX_DIR)


# Global Singleton Instance
resource_manager = ResourceManager()

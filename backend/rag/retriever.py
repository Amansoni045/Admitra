from typing import List, Tuple
from langchain_core.documents import Document
from langchain_core.vectorstores import VectorStoreRetriever
from langchain_community.vectorstores import FAISS

from backend.config.settings import (
    ACADEMICS_PDF_PATH,
    FEE_STRUCTURE_PDF_PATH,
    RETRIEVAL_K,
)
from backend.rag.vectorstore import build_vectorstore_from_pdf


def build_retriever(pdf_path: str, k: int = RETRIEVAL_K) -> VectorStoreRetriever:
    vectorstore = build_vectorstore_from_pdf(pdf_path)
    return vectorstore.as_retriever(search_kwargs={"k": k})


class LazyRetriever:
    """Delays PDF embedding and FAISS index build until first query."""
    def __init__(self, pdf_path: str, k: int = RETRIEVAL_K):
        self.pdf_path = pdf_path
        self.k = k
        self._vectorstore: FAISS | None = None

    @property
    def vectorstore(self) -> FAISS:
        if self._vectorstore is None:
            self._vectorstore = build_vectorstore_from_pdf(self.pdf_path)
        return self._vectorstore

    def invoke(self, query: str) -> List[Document]:
        retriever = self.vectorstore.as_retriever(search_kwargs={"k": self.k})
        return retriever.invoke(query)

    def similarity_search_with_score(self, query: str, k: int | None = None) -> List[Tuple[Document, float]]:
        target_k = k if k is not None else self.k
        return self.vectorstore.similarity_search_with_score(query, k=target_k)


academic_retriever = LazyRetriever(ACADEMICS_PDF_PATH)
fee_retriever = LazyRetriever(FEE_STRUCTURE_PDF_PATH)

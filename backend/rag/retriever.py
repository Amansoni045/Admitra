from typing import List, Tuple
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS

from backend.config.settings import RETRIEVAL_K
from backend.startup.resource_manager import resource_manager


class LazyRetriever:
    """
    Singleton-backed retriever that delegates vector queries to pre-loaded
    offline FAISS indexes managed by ResourceManager.
    """

    def __init__(self, key: str, k: int = RETRIEVAL_K):
        self.key = key
        self.k = k

    @property
    def vectorstore(self) -> FAISS:
        if self.key == "academic":
            return resource_manager.get_academic_vectorstore()
        else:
            return resource_manager.get_fee_vectorstore()

    def invoke(self, query: str) -> List[Document]:
        retriever = self.vectorstore.as_retriever(search_kwargs={"k": self.k})
        return retriever.invoke(query)

    def similarity_search_with_score(
        self, query: str, k: int | None = None
    ) -> List[Tuple[Document, float]]:
        target_k = k if k is not None else self.k
        return self.vectorstore.similarity_search_with_score(query, k=target_k)


academic_retriever = LazyRetriever("academic")
fee_retriever = LazyRetriever("fee")

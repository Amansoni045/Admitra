from typing import List
from langchain_core.embeddings import Embeddings
from langchain_huggingface import HuggingFaceEmbeddings
from backend.config.settings import EMBEDDING_MODEL_NAME


def get_embeddings() -> HuggingFaceEmbeddings:
    return HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL_NAME,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True}
    )


class LazyEmbeddings(Embeddings):
    """
    Lazy proxy for HuggingFaceEmbeddings inheriting from LangChain Embeddings base class.
    Defers model downloading/loading until first document indexing or retrieval query.
    """
    def __init__(self):
        self._embeddings: HuggingFaceEmbeddings | None = None

    @property
    def instance(self) -> HuggingFaceEmbeddings:
        if self._embeddings is None:
            self._embeddings = get_embeddings()
        return self._embeddings

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return self.instance.embed_documents(texts)

    def embed_query(self, text: str) -> List[float]:
        return self.instance.embed_query(text)

    def __call__(self, text: str) -> List[float]:
        return self.embed_query(text)


embeddings = LazyEmbeddings()

from typing import List
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from langchain_core.embeddings import Embeddings


def get_embeddings() -> FastEmbedEmbeddings:
    return FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")


class LazyEmbeddings(Embeddings):
    """
    Ultra-lightweight ONNX-powered embedding proxy (FastEmbed).
    Uses <50MB RAM (compared to PyTorch's 450MB+ footprint), completely preventing
    Render 512MB Out-Of-Memory (OOM) backend crashes during RAG retrieval queries.
    """
    def __init__(self):
        self._embeddings: FastEmbedEmbeddings | None = None

    @property
    def instance(self) -> FastEmbedEmbeddings:
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

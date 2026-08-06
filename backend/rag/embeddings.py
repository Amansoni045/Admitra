from typing import List
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from langchain_core.embeddings import Embeddings


def get_embeddings() -> FastEmbedEmbeddings:
    """Returns FastEmbed ONNX embedding engine instance."""
    return FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")


class LazyEmbeddings(Embeddings):
    """
    Delegates embedding requests to the singleton FastEmbed ONNX engine
    managed by ResourceManager.
    """

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        from backend.startup.resource_manager import resource_manager
        return resource_manager.get_embeddings().embed_documents(texts)

    def embed_query(self, text: str) -> List[float]:
        from backend.startup.resource_manager import resource_manager
        return resource_manager.get_embeddings().embed_query(text)

    def __call__(self, text: str) -> List[float]:
        return self.embed_query(text)


embeddings = LazyEmbeddings()

from langchain_huggingface import HuggingFaceEmbeddings
from backend.config.settings import EMBEDDING_MODEL_NAME


def get_embeddings() -> HuggingFaceEmbeddings:
    return HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL_NAME,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True}
    )


embeddings: HuggingFaceEmbeddings = get_embeddings()

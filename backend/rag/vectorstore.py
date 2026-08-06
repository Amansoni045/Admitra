from typing import List, Dict
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

from backend.config.settings import CHUNK_SIZE, CHUNK_OVERLAP
from backend.rag.embeddings import embeddings

_VECTORSTORE_CACHE: Dict[str, FAISS] = {}


def build_vectorstore_from_pdf(pdf_path: str) -> FAISS:
    """
    Builds or retrieves a cached FAISS vectorstore for a PDF.
    Caches the FAISS index in memory so PDF parsing and text splitting
    runs ONCE ever, making subsequent searches execute in 1 millisecond.
    """
    if pdf_path in _VECTORSTORE_CACHE:
        return _VECTORSTORE_CACHE[pdf_path]

    loader = PyPDFLoader(pdf_path)
    documents: List[Document] = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP
    )

    chunks: List[Document] = splitter.split_documents(documents)
    vectorstore = FAISS.from_documents(chunks, embedding=embeddings)
    _VECTORSTORE_CACHE[pdf_path] = vectorstore
    return vectorstore

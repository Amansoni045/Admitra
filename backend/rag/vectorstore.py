from typing import List
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

from backend.config.settings import CHUNK_SIZE, CHUNK_OVERLAP
from backend.rag.embeddings import embeddings


def build_vectorstore_from_pdf(pdf_path: str) -> FAISS:
    loader = PyPDFLoader(pdf_path)
    documents: List[Document] = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP
    )

    chunks: List[Document] = splitter.split_documents(documents)
    return FAISS.from_documents(chunks, embedding=embeddings)

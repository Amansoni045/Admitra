import os
import sys
from pathlib import Path

# Add project root to path
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from backend.config.settings import (
    ACADEMICS_PDF_PATH,
    FEE_STRUCTURE_PDF_PATH,
    CHUNK_SIZE,
    CHUNK_OVERLAP,
)
from backend.rag.embeddings import get_embeddings

INDEXES_DIR = ROOT_DIR / "backend" / "indexes"


def build_and_save_index(pdf_path: str, output_dir: Path, name: str) -> None:
    print(f"[{name}] Reading PDF: {pdf_path}")
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found at: {pdf_path}")

    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    print(f"[{name}] Loaded {len(documents)} pages.")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP
    )
    chunks = splitter.split_documents(documents)
    print(f"[{name}] Split into {len(chunks)} chunks.")

    print(f"[{name}] Generating embeddings and building FAISS index...")
    embeddings = get_embeddings()
    vectorstore = FAISS.from_documents(chunks, embedding=embeddings)

    output_dir.mkdir(parents=True, exist_ok=True)
    vectorstore.save_local(str(output_dir))
    print(f"[{name}] FAISS index successfully saved to: {output_dir}\n")


def main() -> None:
    print("=== Starting Pre-computed FAISS Index Build ===\n")
    academic_out = INDEXES_DIR / "academic_index"
    fee_out = INDEXES_DIR / "fee_index"

    build_and_save_index(ACADEMICS_PDF_PATH, academic_out, "Academic Handbook")
    build_and_save_index(FEE_STRUCTURE_PDF_PATH, fee_out, "Fee Structure")

    print("=== FAISS Index Pre-computation Complete! ===")


if __name__ == "__main__":
    main()

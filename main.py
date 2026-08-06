import threading
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes import ChatRequest, handle_chat_request
from backend.rag.retriever import academic_retriever, fee_retriever

app = FastAPI(title="Admitra API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def prewarm_vectorstores():
    """Background pre-warming of FAISS vectorstores at server launch."""
    try:
        _ = academic_retriever.vectorstore
        _ = fee_retriever.vectorstore
    except Exception as e:
        print(f"Vectorstore prewarming notice: {e}")


@app.on_event("startup")
def startup_event():
    # Pre-warm vectorstores in a background thread so Uvicorn binds port instantly
    threading.Thread(target=prewarm_vectorstores, daemon=True).start()


@app.get("/")
def health_check():
    return {"status": "healthy", "service": "Admitra AI Assistant Backend"}


@app.post("/api/chat")
def chat_endpoint(payload: ChatRequest):
    return handle_chat_request(payload)

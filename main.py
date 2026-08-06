import logging
import threading
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes import ChatRequest, handle_chat_request
from backend.startup.resource_manager import resource_manager

logger = logging.getLogger("admitra.main")

app = FastAPI(title="Admitra API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def async_prewarm():
    """Background pre-warming of singletons (LLM, Embeddings, FAISS indexes)."""
    try:
        logger.info("Pre-warming singleton resources in background thread...")
        _ = resource_manager.get_academic_vectorstore()
        _ = resource_manager.get_fee_vectorstore()
        _ = resource_manager.get_llm()
        logger.info("Singleton resources successfully pre-warmed!")
    except Exception as e:
        logger.warning(f"Background pre-warming notice: {e}")


@app.on_event("startup")
def startup_event():
    # Instantly bind port and pre-warm heavy resources in background
    threading.Thread(target=async_prewarm, daemon=True).start()


@app.get("/")
def health_check():
    return {"status": "healthy", "service": "Admitra AI Assistant Backend"}


@app.post("/api/chat")
def chat_endpoint(payload: ChatRequest):
    return handle_chat_request(payload)

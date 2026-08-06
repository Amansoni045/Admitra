from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes import ChatRequest, handle_chat_request

app = FastAPI(title="Admitra API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "healthy", "service": "Admitra AI Assistant Backend"}


@app.post("/api/chat")
def chat_endpoint(payload: ChatRequest):
    return handle_chat_request(payload)

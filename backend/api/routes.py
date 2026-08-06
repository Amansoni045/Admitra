from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from backend.app import chat


class ChatRequest(BaseModel):
    programme: str = Field(..., example="BCA", description="Student academic programme")
    message: str = Field(..., example="What are the exam pass marks?", description="User query text")
    developer_mode: bool = Field(default=False, description="Enable pipeline diagnostics")


class ChatResponse(BaseModel):
    answer: str = Field(..., description="Generated natural language response")
    query_type: Optional[str] = Field(default=None, description="Classified intent")
    diagnostics: Optional[Dict[str, Any]] = Field(default=None, description="Pipeline diagnostics in developer mode")


def handle_chat_request(payload: ChatRequest) -> Dict[str, Any]:
    return chat(
        programme=payload.programme,
        message=payload.message,
        developer_mode=payload.developer_mode
    )

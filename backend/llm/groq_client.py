import os
from langchain_groq import ChatGroq
from backend.config.settings import GROQ_MODEL_NAME, LLM_TEMPERATURE


def get_groq_llm() -> ChatGroq:
    api_key = os.getenv("GROQ_API_KEY") or "gsk_placeholder_set_groq_api_key_in_env"
    return ChatGroq(
        model=GROQ_MODEL_NAME,
        temperature=LLM_TEMPERATURE,
        groq_api_key=api_key
    )


class LazyGroqLLM:
    """Wrapper to delay initializing ChatGroq until first actual call."""
    def __init__(self):
        self._instance: ChatGroq | None = None

    @property
    def instance(self) -> ChatGroq:
        if self._instance is None:
            self._instance = get_groq_llm()
        return self._instance

    def invoke(self, *args, **kwargs):
        return self.instance.invoke(*args, **kwargs)


llm = LazyGroqLLM()

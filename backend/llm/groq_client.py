from langchain_groq import ChatGroq
from backend.startup.resource_manager import resource_manager


def get_groq_llm() -> ChatGroq:
    """Returns the singleton Groq LLM instance managed by ResourceManager."""
    return resource_manager.get_llm()


class LazyGroqLLM:
    """Delegates LLM calls to the singleton Groq LLM instance."""

    def invoke(self, *args, **kwargs):
        return get_groq_llm().invoke(*args, **kwargs)


llm = LazyGroqLLM()

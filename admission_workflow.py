from h11._abnf import chunk_size
import os 
from typing import TypedDict , Annotated 
from langgraph.graph.message import add_messages 
from langgraph.graph import StateGraph, START, END  
from langchain_groq import ChatGroq
from langchain_community.document_loaders import PyPDFLoader 
from langchain_text_splitters import RecursiveCharacterTextSplitter 
from langchain_huggingface import HuggingFaceEmbeddings 
from langchain_community.vectorstores import FAISS  
from dotenv import load_dotenv
load_dotenv()


embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def build_retriever(pdf_path : str):
    loader = PyPDFLoader(pdf_path)
    document = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_oevrlap = 100)

    chunks = splitter.split_documents(document) 

    vectorstore = FAISS.from_documents(chunks, embedding=embeddings) 

    return vectorstore.as_retriever(search_kwargs = {"k":4})

academic_retriever = build_retriever("academics_handook.pdf")
fee_retriever = build_retriever("fee_structure.pdf")

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.4)


class State(TypedDict):
    programme : str 
    messages : Annotated[list, add_messages]
    query_type : str 
    retrieved_context : str   


def classifier_node(state: State) -> dict: 
    """Look at the latest user message and decide which path to take.""" 

    last_message = state['messages'][-1].content 

    prompt = (
        "Classify the following student query into exactly one category: "
        "'academic', 'fee', or 'general'.\n\n"
        "Use 'academic' for questions about attendance, exams, grading, credits, "
        "promotion, course structure, summer training, or degree requirements.\n"
        "Use 'fee' for questions about tuition, payment, refund, late charges, "
        "scholarships, or any money-related topic.\n"
        "Use 'general' for greetings, casual talk, or anything not related to "
        "the college rules or fee.\n\n"
        f"Query: {last_message}\n\n"
        "Return only one word: academic, fee, or general."
    )

    response = llm.invoke(prompt)
    category = response.content.strip().lower()

    if "academic" in category:
        category = "academic" 
    elif "fee" in category:
        category = "fee" 
    else :
        category = "general"

    return {"query_type" : category}
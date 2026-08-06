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
from typing import List, Dict, Any

class ChunkingService:
    """
    Splits large text extracted from PDFs into smaller, context-aware chunks 
    that fit comfortably inside the context window of LLMs and embed models.
    """
    
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        
    def create_chunks(self, text: str, metadata: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """
        Splits text by character length (can be upgraded to semantic splitters like LangChain's RecursiveCharacterTextSplitter).
        """
        chunks = []
        if not text:
            return chunks
            
        start = 0
        while start < len(text):
            end = start + self.chunk_size
            chunk_text = text[start:end]
            
            chunks.append({
                "text": chunk_text,
                "metadata": metadata or {}
            })
            
            start += self.chunk_size - self.chunk_overlap
            
        return chunks

chunking_service = ChunkingService()

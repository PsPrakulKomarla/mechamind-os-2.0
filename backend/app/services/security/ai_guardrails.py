import re
from typing import Dict, Any

class AIGuardrails:
    """
    Defends the LLM and RAG pipelines against prompt injection, 
    data leakage, and hallucination risks.
    """
    
    # Common injection keywords
    INJECTION_PATTERNS = [
        r"(?i)ignore\s+all\s+previous\s+instructions",
        r"(?i)system\s+prompt",
        r"(?i)you\s+are\s+now\s+a\s+different\s+ai",
        r"(?i)forget\s+everything"
    ]
    
    def detect_prompt_injection(self, user_input: str) -> bool:
        """
        Returns True if a prompt injection attempt is detected.
        """
        for pattern in self.INJECTION_PATTERNS:
            if re.search(pattern, user_input):
                return True
        return False
        
    def enforce_confidence_threshold(self, llm_response: Dict[str, Any], minimum_confidence: float = 0.7) -> Dict[str, Any]:
        """
        If the AI agent returns a response with low confidence, we intercept it 
        and return a safe fallback to prevent hallucinations from causing operational damage.
        """
        confidence = llm_response.get("confidence_score", 1.0)
        
        if confidence < minimum_confidence:
            return {
                "answer": "I do not have enough evidence to answer this query safely. Please consult a human technician.",
                "confidence_score": confidence,
                "sources": []
            }
            
        return llm_response

ai_guardrails = AIGuardrails()

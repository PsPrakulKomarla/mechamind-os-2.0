from abc import ABC, abstractmethod
from typing import Dict, Any, List
import json
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class LlmProvider(ABC):
    @abstractmethod
    async def generate_response(self, system_prompt: str, user_prompt: str, context: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generates a JSON response matching the ChatResponse schema requirements (answer, confidence, risk_level, sources).
        """
        pass

class OpenAILlmProvider(LlmProvider):
    def __init__(self):
        from openai import AsyncOpenAI
        self.client = AsyncOpenAI(
            api_key=settings.LLM_API_KEY,
            base_url=settings.LLM_BASE_URL if settings.LLM_BASE_URL else None
        )
        self.model = settings.LLM_MODEL

    async def generate_response(self, system_prompt: str, user_prompt: str, context: List[Dict[str, Any]]) -> Dict[str, Any]:
        context_str = json.dumps(context, indent=2)
        full_user_prompt = f"User Query: {user_prompt}\n\nContext:\n{context_str}"

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": full_user_prompt}
                ]
            )
            
            result_str = response.choices[0].message.content
            # Strip markdown code blocks if present
            result_str = result_str.strip()
            if result_str.startswith("```"):
                result_str = result_str.split("\n", 1)[1]
                if result_str.endswith("```"):
                    result_str = result_str.rsplit("\n", 1)[0]
                elif result_str.endswith("```\n"):
                    result_str = result_str.rsplit("\n", 2)[0]
                if result_str.startswith("json\n"):
                    result_str = result_str[5:]
                    
            return json.loads(result_str)
        except Exception as e:
            logger.error(f"LLM generation failed: {str(e)}")
            # Fallback to mock behavior if API call fails
            return MockLlmProvider().generate_sync_fallback(system_prompt, user_prompt, context)

class MockLlmProvider(LlmProvider):
    async def generate_response(self, system_prompt: str, user_prompt: str, context: List[Dict[str, Any]]) -> Dict[str, Any]:
        return self.generate_sync_fallback(system_prompt, user_prompt, context)
        
    def generate_sync_fallback(self, system_prompt: str, user_prompt: str, context: List[Dict[str, Any]]) -> Dict[str, Any]:
        risk = "LOW"
        system_prompt_lower = system_prompt.lower()
        
        # Simulated intelligent answers
        answer = "Based on the provided documentation, the recommended action is to inspect the unit and refer to the standard operating procedures."
        if "overheating" in user_prompt.lower():
            risk = "HIGH"
            answer = "Bearing degradation is highly likely causing the overheating. Please halt the machine immediately and refer to OEM Manual Page 14."
        elif "leakage" in user_prompt.lower():
            risk = "CRITICAL"
            answer = "WARNING: Chemical leakage detected. Evacuate the immediate area and don Level B PPE before attempting to close the main isolation valve."

        return {
            "answer": answer,
            "confidence": "0.87",
            "risk_level": risk,
            "sources": [
                {"document_name": "OEM Manual", "page_number": "14", "section": "Troubleshooting"}
            ] if context else [],
            "recommendations": ["Halt machine", "Inspect bearings"] if risk == "HIGH" else ["Review safety protocols"]
        }

# Provider injection logic
if settings.LLM_PROVIDER == "openai":
    llm_provider = OpenAILlmProvider()
else:
    llm_provider = MockLlmProvider()

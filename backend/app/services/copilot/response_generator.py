from typing import Dict, Any, List
from app.core.llm import llm_provider
from app.services.copilot.prompt_manager import prompt_manager

class ResponseGenerator:
    """
    Handles prompt assembly and calls the LLM, returning a structured response.
    """
    async def generate(self, query: str, context: List[Dict[str, Any]]) -> Dict[str, Any]:
        system_prompt = prompt_manager.get_system_prompt()
        
        # We pass the raw context blocks into the LLM
        response = await llm_provider.generate_response(system_prompt, query, context)
        return response

response_generator = ResponseGenerator()

from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

class SolutionEvaluationEngine:
    """
    Evaluates a proposed solution prior to human expert review.
    In a real ML pipeline, this would cluster the text against past failures.
    For this OS prototype, we calculate a mock confidence score.
    """
    
    async def evaluate_proposal(self, db: AsyncSession, problem: str, solution: str) -> float:
        # Mock evaluation: if it contains safety words, it gets a lower automated score 
        # so experts are forced to look closer.
        score = 0.70
        
        low_confidence_triggers = ["override", "bypass", "ignore", "temporary fix"]
        high_confidence_triggers = ["replaced", "calibrated", "OEM", "standard procedure"]
        
        lower_sol = solution.lower()
        if any(trigger in lower_sol for trigger in low_confidence_triggers):
            score -= 0.30
            
        if any(trigger in lower_sol for trigger in high_confidence_triggers):
            score += 0.20
            
        return min(max(score, 0.0), 1.0)

solution_evaluation_engine = SolutionEvaluationEngine()

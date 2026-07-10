class RecommendationEngine:
    """
    Cost Optimization Engine. Analyzes repair vs replacement costs and 
    machine lifecycle to recommend the most cost-effective action.
    """
    
    def generate_optimal_repair_strategy(self, machine_data: dict, failure_severity: str) -> dict:
        # In a real scenario, this queries ERP for part costs and labour rates.
        # We mock the financial decision tree here for the OS Prototype.
        
        estimated_repair_cost = 1500.0
        estimated_replace_cost = 5000.0
        
        # If repair is > 60% of replacement and severity is high, recommend replace
        if (estimated_repair_cost / estimated_replace_cost) > 0.6 and failure_severity in ["HIGH", "CRITICAL"]:
            return {
                "decision": "REPLACE",
                "reason": "Repair cost exceeds 60% of replacement cost on a critical failure.",
                "estimated_repair_cost": estimated_repair_cost,
                "estimated_replace_cost": estimated_replace_cost
            }
            
        return {
            "decision": "REPAIR",
            "reason": "Repair is significantly more cost-effective.",
            "estimated_repair_cost": estimated_repair_cost,
            "estimated_replace_cost": estimated_replace_cost
        }

recommendation_engine = RecommendationEngine()

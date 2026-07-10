from abc import ABC, abstractmethod
from typing import Dict, Any, List

class LlmProvider(ABC):
    @abstractmethod
    async def generate_response(self, system_prompt: str, user_prompt: str, context: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generates a JSON response matching the ChatResponse schema requirements (answer, confidence, risk_level, sources).
        """
        pass

class MockLlmProvider(LlmProvider):
    """
    Simulates an LLM parsing context chunks and generating a strictly formatted RAG response.
    Used for prototyping without requiring API keys.
    """
    async def generate_response(self, system_prompt: str, user_prompt: str, context: List[Dict[str, Any]]) -> Dict[str, Any]:
        
        # Analyze user prompt for risk
        risk = "LOW"
        system_prompt_lower = system_prompt.lower()
        if "root cause analysis" in system_prompt_lower or "rca" in system_prompt_lower:
            # Simulate structured RCA JSON output
            return {
                "answer": "RCA Generation",
                "risk_level": "HIGH",
                "confidence": 0.85,
                "sources": ["Machine Manual Page 12", "Historical Failure 992"],
                "recommendations": ["Inspect immediately"],
                # RCA specific injections
                "rca_payload": {
                    "problem_summary": user_prompt,
                    "possible_causes": [
                        {"cause": "Bearing wear", "probability": "85%", "evidence": "Matches historical vibration patterns"},
                        {"cause": "Misalignment", "probability": "70%", "evidence": "Common in similar pump models"}
                    ],
                    "recommended_actions": {
                        "immediate": ["Shut down pump", "Check bearing temp"],
                        "short_term": ["Re-align shaft", "Replace primary bearing"],
                        "long_term": ["Install continuous vibration sensor"]
                    },
                    "safety_warning": "Ensure power is locked out before opening pump casing."
                }
            }
            
        if "compliance check" in system_prompt_lower or "iso" in user_prompt.lower():
            return {
                "answer": "Compliance Assessment",
                "risk_level": "MEDIUM",
                "confidence": 0.90,
                "sources": ["ISO 45001 Manual"],
                "recommendations": ["Upload missing training certificates"],
                "compliance_payload": {
                    "score": 85.0,
                    "risk_level": "MEDIUM",
                    "findings": [
                        {
                            "issue": "Missing operator training certificates for Pump P-101.",
                            "severity": "MAJOR",
                            "recommendation": "Conduct immediate training and upload logs."
                        }
                    ]
                }
            }
            
        if "audit package" in system_prompt_lower:
            return {
                "answer": "Audit Generated",
                "risk_level": "LOW",
                "confidence": 0.95,
                "sources": [],
                "recommendations": [],
                "audit_payload": {
                    "regulation_code": "ISO 45001",
                    "completion_percentage": 85.0,
                    "missing_evidence": ["Training records", "Inspection certificates"],
                    "compliance_summary": "Factory is mostly compliant. Two minor documentation gaps identified."
                }
            }

        if "safety analysis" in system_prompt_lower:
            return {
                "answer": "Safety Report",
                "risk_level": "HIGH",
                "confidence": 0.88,
                "sources": [],
                "recommendations": [],
                "safety_payload": [
                    {
                        "hazard": "Unmitigated slip risk near P-101 due to frequent leaks.",
                        "severity": "CRITICAL",
                        "missing_controls": ["Spill containment berm", "Daily leak inspection log"]
                    }
                ]
            }

        if "computer vision" in system_prompt_lower or "detect defects" in system_prompt_lower:
            return {
                "answer": "Vision Analysis",
                "risk_level": "HIGH",
                "confidence": 0.92,
                "sources": ["YOLOv8 Weights"],
                "recommendations": [],
                "vision_payload": {
                    "asset_tag_detected": "P-101",
                    "defects": [
                        {
                            "defect_type": "LEAKAGE",
                            "severity": "HIGH",
                            "confidence": 0.95,
                            "location": {"x": 120, "y": 450, "w": 200, "h": 50},
                            "description": "Visible oil pooling beneath the bearing housing."
                        }
                    ]
                }
            }

        if "when will" in user_prompt.lower() and "fail" in user_prompt.lower():
            return {
                "answer": "Based on the latest telemetry showing high vibration and the vision analysis showing leakage, the main bearing is predicted to fail within the next 48 to 72 hours. Remaining Useful Life (RUL) is estimated at 60 hours. I recommend a controlled shutdown and replacement to save an estimated $15,000 in collateral damage.",
                "risk_level": "CRITICAL",
                "confidence": 0.89,
                "sources": ["Sensor: P-101-V1", "Vision Model", "Maintenance History"],
                "recommendations": ["Initiate controlled shutdown within 24 hours.", "Order replacement bearing part #B-992."]
            }
            
        if "which machines need maintenance" in user_prompt.lower():
            return {
                "answer": "Currently, 3 machines require immediate attention: \n1. P-101 (Predicted Bearing Failure - 60h RUL)\n2. M-202 (Overheating Trend Detected)\n3. V-305 (Vision detected Rust - Low Priority)",
                "risk_level": "HIGH",
                "confidence": 0.95,
                "sources": ["Digital Twin States"],
                "recommendations": ["Dispatch tech to P-101", "Inspect M-202 cooling system"]
            }

        if "leak" in user_prompt.lower() or "fire" in user_prompt.lower():
            risk = "CRITICAL"
        elif "overheating" in user_prompt.lower():
            risk = "HIGH"
            
        # Mocking an intelligent synthesis of the context
        answer = "Based on the provided documentation, the recommended action is to inspect the unit and refer to the standard operating procedures."
        if "overheating" in user_prompt.lower():
            answer = "Bearing degradation is highly likely causing the overheating. Please halt the machine immediately and refer to OEM Manual Page 14."
        elif "leakage" in user_prompt.lower():
            answer = "WARNING: Chemical leakage detected. Evacuate the immediate area and don Level B PPE before attempting to close the main isolation valve."
            
        return {
            "answer": answer,
            "confidence": "87%",
            "risk_level": risk,
            "sources": [
                {"document_name": "OEM Manual", "page_number": "14", "section": "Troubleshooting"}
            ] if context else [],
            "recommendations": ["Halt machine", "Inspect bearings"] if risk == "HIGH" else ["Review safety protocols"]
        }

# Provider injection
llm_provider = MockLlmProvider()

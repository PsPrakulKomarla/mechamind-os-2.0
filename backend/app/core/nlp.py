import re
from abc import ABC, abstractmethod
from typing import List, Dict, Any
from app.models.enums import ExtractedEntityType

class NlpProvider(ABC):
    @abstractmethod
    def extract_entities(self, text: str) -> List[Dict[str, Any]]:
        pass
        
    @abstractmethod
    def extract_relationships(self, entities: List[Dict[str, Any]], text: str) -> List[Dict[str, Any]]:
        pass

class SpacyNlpProvider(NlpProvider):
    """
    Implements actual rule-based NLP extraction logic using regex patterns to simulate a
    trained industrial spaCy Matcher pipeline.
    """
    
    def extract_entities(self, text: str) -> List[Dict[str, Any]]:
        entities = []
        
        # 1. Machine Tag Regex: E.g., Pump P-101, Compressor C-20A, Motor M-1
        machine_pattern = r'\b(Pump|Compressor|Motor|Turbine|Boiler|Valve)\s+([A-Z]-\d{1,4}[A-Z]?)\b'
        for match in re.finditer(machine_pattern, text, re.IGNORECASE):
            entities.append({
                "type": ExtractedEntityType.MACHINE,
                "name": f"{match.group(1)} {match.group(2)}".title(),
                "value": match.group(2).upper(),
                "confidence": 0.95,
                "start": match.start(),
                "end": match.end()
            })
            
        # 2. Parameters Regex: E.g., 300 PSI, 1500 RPM, 120 C
        param_pattern = r'\b(\d+(?:\.\d+)?)\s*(PSI|RPM|C|F|V|A|kW|bar)\b'
        for match in re.finditer(param_pattern, text, re.IGNORECASE):
            entities.append({
                "type": ExtractedEntityType.PARAMETER,
                "name": f"{match.group(1)} {match.group(2)}",
                "value": match.group(1),
                "metadata": {"unit": match.group(2).upper()},
                "confidence": 0.90,
                "start": match.start(),
                "end": match.end()
            })
            
        # 3. Failures Regex
        failures = ["overheating", "leakage", "corrosion", "vibration", "wear", "breakdown", "pressure loss"]
        failure_pattern = r'\b(' + '|'.join(failures) + r')\b'
        for match in re.finditer(failure_pattern, text, re.IGNORECASE):
            entities.append({
                "type": ExtractedEntityType.FAILURE,
                "name": match.group(1).title(),
                "confidence": 0.88,
                "start": match.start(),
                "end": match.end()
            })

        return entities

    def extract_relationships(self, entities: List[Dict[str, Any]], text: str) -> List[Dict[str, Any]]:
        relationships = []
        
        # Simple distance-based relationship extraction
        # If a failure occurs close to a machine, they are related.
        machines = [e for e in entities if e["type"] == ExtractedEntityType.MACHINE]
        failures = [e for e in entities if e["type"] == ExtractedEntityType.FAILURE]
        parameters = [e for e in entities if e["type"] == ExtractedEntityType.PARAMETER]
        
        for m in machines:
            for f in failures:
                # If they appear within 100 characters of each other
                if abs(m["start"] - f["start"]) < 100:
                    relationships.append({
                        "source_index": entities.index(m),
                        "target_index": entities.index(f),
                        "type": "EXPERIENCES",
                        "confidence": 0.85
                    })
            for p in parameters:
                if abs(m["start"] - p["start"]) < 80:
                    relationships.append({
                        "source_index": entities.index(m),
                        "target_index": entities.index(p),
                        "type": "OPERATES_AT",
                        "confidence": 0.90
                    })
                    
        return relationships

nlp_provider = SpacyNlpProvider()

import pytest
from app.core.nlp import nlp_provider
from app.models.enums import ExtractedEntityType

def test_nlp_entity_extraction_regex():
    """Test the mock spaCy NLP regex rules."""
    text = "The new Pump P-101 was installed yesterday. It is experiencing severe overheating at 300 PSI."
    
    entities = nlp_provider.extract_entities(text)
    
    assert len(entities) == 3
    
    machine = next((e for e in entities if e["type"] == ExtractedEntityType.MACHINE), None)
    assert machine is not None
    assert machine["name"] == "Pump P-101"
    assert machine["value"] == "P-101"
    
    failure = next((e for e in entities if e["type"] == ExtractedEntityType.FAILURE), None)
    assert failure is not None
    assert failure["name"] == "Overheating"
    
    param = next((e for e in entities if e["type"] == ExtractedEntityType.PARAMETER), None)
    assert param is not None
    assert param["value"] == "300"
    assert param["metadata"]["unit"] == "PSI"

def test_nlp_relationship_extraction():
    """Test distance-based relationship mapping."""
    text = "Pump P-101 experienced overheating."
    entities = nlp_provider.extract_entities(text)
    rels = nlp_provider.extract_relationships(entities, text)
    
    assert len(rels) == 1
    assert rels[0]["type"] == "EXPERIENCES"
    # Source should be the machine, target the failure
    assert entities[rels[0]["source_index"]]["type"] == ExtractedEntityType.MACHINE
    assert entities[rels[0]["target_index"]]["type"] == ExtractedEntityType.FAILURE

from abc import ABC, abstractmethod
from typing import Dict, Any, List

class OcrProvider(ABC):
    """Abstract Base Class for OCR Engines (Tesseract, Azure, etc.)"""
    
    @abstractmethod
    def extract_text(self, image_path: str) -> str:
        """Extract plain text from an image"""
        pass
        
    @abstractmethod
    def extract_data(self, image_path: str) -> List[Dict[str, Any]]:
        """Extract text along with bounding boxes and confidence scores"""
        pass

class TesseractOcrProvider(OcrProvider):
    """Implementation using PyTesseract"""
    
    def extract_text(self, image_path: str) -> str:
        # In a real environment, requires `import pytesseract` and `from PIL import Image`
        # Mocking for prototype
        return f"[MOCK TESSERACT] Extracted text from {image_path}"

    def extract_data(self, image_path: str) -> List[Dict[str, Any]]:
        return [
            {
                "text": "[MOCK TESSERACT] Sample text block",
                "confidence": 0.95,
                "bbox": {"x1": 10, "y1": 10, "x2": 100, "y2": 50}
            }
        ]

# Factory pattern for future swap-outs
def get_ocr_provider() -> OcrProvider:
    return TesseractOcrProvider()

ocr_provider = get_ocr_provider()

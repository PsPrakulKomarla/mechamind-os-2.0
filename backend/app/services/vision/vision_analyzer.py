from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.models.vision import MediaFile, VisionAnalysis, DetectedDefect
from app.models.enums import DefectType, FindingSeverity, AnalysisStatus
from app.repositories.vision import vision_repository
from app.services.vision.cv_provider import cv_provider
from app.services.maintenance.rca_engine import rca_engine
from app.repositories.machine import machine_repository

class VisionAnalyzer:
    """
    Orchestrates the Computer Vision pipeline and links it to Machine Intelligence and RCA.
    """
    
    async def process_media(self, db: AsyncSession, media_id: UUID) -> dict:
        media = await vision_repository.get_media_file(db, media_id)
        if not media:
            raise ValueError("Media not found")
            
        media.status = AnalysisStatus.PROCESSING
        await db.commit()
        
        # 1. Run raw CV inference (YOLO / Vision Transformers)
        cv_payload = await cv_provider.analyze_media(media.file_path, media.file_type)
        
        # 2. Asset Matching
        # If the CV detected a tag (e.g. P-101), we can try to link it.
        # In a real scenario, we'd query machine_repository by tag.
        # For now, if the payload has defects, we proceed.
        
        # 3. Create Vision Analysis Record
        defects = cv_payload.get("defects", [])
        max_severity = FindingSeverity.MINOR
        
        db_defects = []
        for d in defects:
            severity = FindingSeverity(d["severity"])
            if severity == FindingSeverity.CRITICAL or (severity == FindingSeverity.MAJOR and max_severity != FindingSeverity.CRITICAL):
                max_severity = severity
                
            db_defects.append(
                DetectedDefect(
                    defect_type=DefectType(d["defect_type"]),
                    location=d["location"],
                    severity=severity,
                    confidence=d["confidence"],
                    description=d["description"]
                )
            )
            
        analysis = VisionAnalysis(
            media_id=media.id,
            asset_id=media.asset_id,
            analysis_type="YOLO_DEFECT_DETECTION",
            confidence_score=0.92,
            severity=max_severity
        )
        
        await vision_repository.save_analysis(db, analysis, db_defects)
        
        media.status = AnalysisStatus.COMPLETED
        await db.commit()
        
        # 4. RCA Integration (AI Intelligence Expansion)
        # If we know the asset and a defect is found, trigger the RCA Engine!
        rca_recommendations = []
        rca_causes = []
        if media.asset_id and len(defects) > 0:
            primary_defect = defects[0]["defect_type"]
            rca_resp = await rca_engine.analyze_failure(db, str(media.asset_id), f"Vision system detected {primary_defect}")
            rca_recommendations = rca_resp.get("recommended_actions", {}).get("immediate", [])
            rca_causes = [c["cause"] for c in rca_resp.get("possible_causes", [])]
            
        return {
            "analysis_id": analysis.id,
            "severity": max_severity,
            "defects": defects,
            "rca_recommendations": rca_recommendations,
            "rca_possible_causes": rca_causes
        }

vision_analyzer = VisionAnalyzer()

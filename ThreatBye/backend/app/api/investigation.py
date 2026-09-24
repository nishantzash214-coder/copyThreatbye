import json
import os

from fastapi import APIRouter, HTTPException


router = APIRouter(
    prefix="/investigation",
    tags=["Investigation"]
)


EVIDENCE_DIR = "evidence"


@router.get("/report/{report_id}")
def get_forensic_report(report_id: str):
    """
    Retrieve a stored forensic report using its Report ID.
    """

    file_path = os.path.join(
        EVIDENCE_DIR,
        f"{report_id}.json"
    )

    # Check whether the report exists
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="Forensic report not found"
        )

    try:
        with open(
            file_path,
            "r",
            encoding="utf-8"
        ) as file:
            evidence = json.load(file)

        return {
            "success": True,
            "evidence": evidence
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to read forensic report: {error}"
        )


@router.get("/verify/{report_id}")
def verify_forensic_report(report_id: str):
    """
    Verify the integrity of a stored forensic report.
    """

    file_path = os.path.join(
        EVIDENCE_DIR,
        f"{report_id}.json"
    )

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="Forensic report not found"
        )

    try:
        with open(
            file_path,
            "r",
            encoding="utf-8"
        ) as file:
            evidence = json.load(file)

        stored_hash = evidence.get("sha256")
        report = evidence.get("report")

        if not stored_hash or not report:
            raise HTTPException(
                status_code=400,
                detail="Invalid evidence record"
            )

        # Recalculate the hash
        from app.services.evillocker_service import create_report_hash

        current_hash = create_report_hash(report)

        # Compare hashes
        is_valid = stored_hash == current_hash

        return {
            "report_id": report_id,
            "integrity_valid": is_valid,
            "stored_sha256": stored_hash,
            "current_sha256": current_hash,
            "message": (
                "Evidence integrity verified successfully."
                if is_valid
                else "WARNING: Evidence may have been modified."
            )
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to verify report: {error}"
        )
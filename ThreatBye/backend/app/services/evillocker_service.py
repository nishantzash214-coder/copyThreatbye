import hashlib
import json
import os
from datetime import datetime, timezone
from uuid import uuid4


EVIDENCE_DIR = "evidence"


def create_report_hash(report: dict) -> str:
    """
    Create a SHA-256 hash of the forensic report.
    This helps verify that the report has not been modified.
    """

    report_data = json.dumps(
        report,
        sort_keys=True,
        default=str
    ).encode("utf-8")

    return hashlib.sha256(report_data).hexdigest()


def store_forensic_report(report: dict) -> dict:
    """
    Store a forensic report in the local Evidence Locker.
    """

    os.makedirs(EVIDENCE_DIR, exist_ok=True)

    report_id = str(uuid4())

    report_hash = create_report_hash(report)

    evidence = {
        "report_id": report_id,
        "stored_at": datetime.now(timezone.utc).isoformat(),
        "sha256": report_hash,
        "report": report
    }

    file_path = os.path.join(
        EVIDENCE_DIR,
        f"{report_id}.json"
    )

    with open(
        file_path,
        "w",
        encoding="utf-8"
    ) as file:
        json.dump(
            evidence,
            file,
            indent=4,
            default=str
        )

    return {
        "report_id": report_id,
        "sha256": report_hash,
        "stored": True,
        "storage_path": file_path
    }
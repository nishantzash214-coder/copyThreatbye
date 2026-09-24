from datetime import datetime, timezone


def generate_forensic_report(
    filename: str,
    parsed_email: dict,
    ioc_data: dict,
    authentication: dict,
    threat_intelligence: dict,
    geolocation: dict,
    ml_prediction: dict,
    risk_analysis: dict
) -> dict:
    """
    Generate a structured forensic report
    from all ThreatBye analysis results.
    """

    report = {
        "report_metadata": {
            "report_type": "ThreatBye Email Forensic Report",
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "filename": filename
        },

        "email_information": {
            "sender": parsed_email.get("sender"),
            "recipient": parsed_email.get("recipient"),
            "subject": parsed_email.get("subject"),
            "date": parsed_email.get("date")
        },

        "indicators_of_compromise": {
            "urls": ioc_data.get("urls", []),
            "ip_addresses": ioc_data.get(
                "ip_addresses",
                []
            ),
            "domains": ioc_data.get(
                "domains",
                []
            )
        },

        "authentication": authentication,

        "threat_intelligence": threat_intelligence,

        "geolocation": geolocation,

        "machine_learning": {
            "prediction": ml_prediction.get(
                "label",
                "unknown"
            ),
            "confidence": ml_prediction.get(
                "confidence",
                0
            )
        },

        "risk_assessment": {
            "score": risk_analysis.get(
                "risk_score",
                0
            ),
            "level": risk_analysis.get(
                "risk_level",
                "UNKNOWN"
            ),
            "reasons": risk_analysis.get(
                "reasons",
                []
            ),
            "recommendation": risk_analysis.get(
                "recommendation",
                ""
            )
        }
    }

    return report
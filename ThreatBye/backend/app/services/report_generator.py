def generate_report(
    email_data: dict,
    iocs: dict,
    threat_analysis: dict,
    risk_analysis: dict
) -> dict:
    """
    Create a clean final ThreatBye email analysis report.
    """

    return {
        "email": {
            "sender": email_data.get("sender"),
            "receiver": email_data.get("receiver"),
            "subject": email_data.get("subject"),
            "date": email_data.get("date"),
        },

        "threat": {
            "risk_score": risk_analysis.get("risk_score", 0),
            "risk_level": risk_analysis.get("risk_level", "SAFE"),
            "reasons": risk_analysis.get("reasons", []),
            "recommendation": risk_analysis.get(
                "recommendation",
                ""
            ),
        },

        "iocs": {
            "urls": iocs.get("urls", []),
            "domains": iocs.get("domains", []),
            "ip_addresses": iocs.get("ip_addresses", []),
            "email_addresses": iocs.get(
                "email_addresses",
                []
            ),
        },

        "detection": {
            "score": threat_analysis.get("score", 0),
            "threat_level": threat_analysis.get(
                "threat_level",
                "safe"
            ),
            "findings": threat_analysis.get(
                "findings",
                []
            ),
        }
    }
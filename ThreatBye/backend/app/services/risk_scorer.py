def calculate_risk_score(
    threat_analysis: dict,
    iocs: dict,
    authentication: dict | None = None,
    threat_intelligence: dict | None = None,
    ml_prediction: dict | None = None
) -> dict:
    """
    Calculate the final ThreatBye risk score.

    Evidence sources:
    1. Threat detection
    2. URLs
    3. IP addresses
    4. SPF/DKIM/DMARC
    5. Threat intelligence
    6. ML prediction
    """

    score = 0
    reasons = []

    # ---------------------------------------------
    # 1. Threat Detector
    # ---------------------------------------------

    detector_score = threat_analysis.get("score", 0)

    score += detector_score

    if detector_score > 0:
        reasons.append(
            f"Threat detection indicators found "
            f"(base score: {detector_score})"
        )

    # ---------------------------------------------
    # 2. URLs
    # ---------------------------------------------

    urls = iocs.get("urls", [])

    if urls:
        url_points = min(len(urls) * 5, 15)
        score += url_points

        reasons.append(
            f"{len(urls)} URL(s) detected"
        )

    # ---------------------------------------------
    # 3. IP Addresses
    # ---------------------------------------------

    ip_addresses = iocs.get("ip_addresses", [])

    if ip_addresses:
        ip_points = min(len(ip_addresses) * 10, 20)
        score += ip_points

        reasons.append(
            f"{len(ip_addresses)} IP address(es) detected"
        )

    # ---------------------------------------------
    # 4. SPF / DKIM / DMARC
    # ---------------------------------------------

    if authentication:

        auth_data = authentication.get(
            "authentication",
            {}
        )

        spf = auth_data.get("spf", "unknown")
        dkim = auth_data.get("dkim", "unknown")
        dmarc = auth_data.get("dmarc", "unknown")

        if spf == "fail":
            score += 15
            reasons.append(
                "SPF authentication failed"
            )

        elif spf == "softfail":
            score += 10
            reasons.append(
                "SPF softfail detected"
            )

        if dkim == "fail":
            score += 15
            reasons.append(
                "DKIM authentication failed"
            )

        if dmarc == "fail":
            score += 20
            reasons.append(
                "DMARC authentication failed"
            )

    # ---------------------------------------------
    # 5. Threat Intelligence
    # ---------------------------------------------

    if threat_intelligence:

        external_intel = threat_intelligence.get(
            "external_intelligence",
            {}
        )

        intel_status = external_intel.get(
            "status",
            "not_connected"
        )

        if intel_status == "malicious":
            score += 30

            reasons.append(
                "Threat intelligence identified "
                "a malicious indicator"
            )

    # ---------------------------------------------
    # 6. Machine Learning
    # ---------------------------------------------

    if ml_prediction:

        prediction = ml_prediction.get(
            "label",
            "unknown"
        )

        confidence = ml_prediction.get(
            "confidence",
            0
        )

        if prediction == "suspicious":

            # Only use high-confidence ML results
            if confidence >= 0.80:

                score += 20

                reasons.append(
                    f"ML model classified the email "
                    f"as suspicious "
                    f"(confidence: {confidence:.2f})"
                )

            elif confidence >= 0.60:

                score += 10

                reasons.append(
                    f"ML model detected suspicious "
                    f"characteristics "
                    f"(confidence: {confidence:.2f})"
                )

    # ---------------------------------------------
    # 7. Limit score
    # ---------------------------------------------

    score = min(score, 100)

    # ---------------------------------------------
    # 8. Determine risk level
    # ---------------------------------------------

    if score >= 70:
        risk_level = "HIGH"

    elif score >= 40:
        risk_level = "MEDIUM"

    elif score > 0:
        risk_level = "LOW"

    else:
        risk_level = "SAFE"

    # ---------------------------------------------
    # 9. Recommendation
    # ---------------------------------------------

    if risk_level == "HIGH":

        recommendation = (
            "Treat this email as highly suspicious. "
            "Avoid interacting with links or providing "
            "sensitive information."
        )

    elif risk_level == "MEDIUM":

        recommendation = (
            "Exercise caution. Verify the sender "
            "and email links before taking action."
        )

    elif risk_level == "LOW":

        recommendation = (
            "Some suspicious indicators were detected. "
            "Review the email carefully."
        )

    else:

        recommendation = (
            "No significant suspicious indicators "
            "were detected."
        )

    return {
        "risk_score": score,
        "risk_level": risk_level,
        "reasons": reasons,
        "recommendation": recommendation
    }
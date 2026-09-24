import re


# Words commonly associated with suspicious/phishing emails.
SUSPICIOUS_KEYWORDS = [
    "urgent",
    "verify your account",
    "verify account",
    "account suspended",
    "account locked",
    "confirm your account",
    "reset your password",
    "click here",
    "immediately",
    "security alert",
    "unusual activity",
    "payment failed",
    "update your information",
    "login",
    "credential",
]


def detect_threat(email_data: dict) -> dict:
    """
    Perform basic rule-based threat detection on a parsed email.
    """

    subject = email_data.get("subject", "")
    body = email_data.get("body", "")

    text = f"{subject}\n{body}".lower()

    findings = []
    score = 0

    # -------------------------------------------------
    # 1. Check suspicious keywords
    # -------------------------------------------------

    for keyword in SUSPICIOUS_KEYWORDS:
        if keyword.lower() in text:
            findings.append({
                "type": "suspicious_keyword",
                "value": keyword,
                "severity": "medium"
            })

            score += 10

    # -------------------------------------------------
    # 2. Check for URLs
    # -------------------------------------------------

    urls = re.findall(
        r"https?://[^\s<>\"]+",
        text
    )

    if urls:
        findings.append({
            "type": "url_present",
            "count": len(urls),
            "severity": "low"
        })

        score += 10

    # -------------------------------------------------
    # 3. Check suspicious urgency language
    # -------------------------------------------------

    urgency_words = [
        "urgent",
        "immediately",
        "as soon as possible",
        "action required",
        "act now",
    ]

    urgency_found = []

    for word in urgency_words:
        if word in text:
            urgency_found.append(word)

    if urgency_found:
        findings.append({
            "type": "urgency_language",
            "values": urgency_found,
            "severity": "medium"
        })

        score += 15

    # -------------------------------------------------
    # Limit score to 100
    # -------------------------------------------------

    score = min(score, 100)

    # -------------------------------------------------
    # Determine threat level
    # -------------------------------------------------

    if score >= 70:
        threat_level = "high"
    elif score >= 40:
        threat_level = "medium"
    elif score > 0:
        threat_level = "low"
    else:
        threat_level = "safe"

    return {
        "threat_level": threat_level,
        "score": score,
        "findings": findings,
    }
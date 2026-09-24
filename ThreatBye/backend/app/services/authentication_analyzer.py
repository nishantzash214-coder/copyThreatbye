import re


def extract_authentication_results(headers: dict) -> dict:
    """
    Extract SPF, DKIM and DMARC results from email headers.
    """

    # Convert headers into one searchable string
    header_text = "\n".join(
        f"{key}: {value}"
        for key, value in headers.items()
    ).lower()

    result = {
        "spf": "unknown",
        "dkim": "unknown",
        "dmarc": "unknown",
        "raw_authentication_results": []
    }

    # -------------------------------------------------
    # Authentication-Results headers
    # -------------------------------------------------

    for key, value in headers.items():

        if key.lower() == "authentication-results":
            result["raw_authentication_results"].append(value)

    # -------------------------------------------------
    # SPF
    # -------------------------------------------------

    spf_match = re.search(
        r"\bspf=(pass|fail|softfail|neutral|none|temperror|permerror)\b",
        header_text
    )

    if spf_match:
        result["spf"] = spf_match.group(1)

    # -------------------------------------------------
    # DKIM
    # -------------------------------------------------

    dkim_match = re.search(
        r"\bdkim=(pass|fail|neutral|none|temperror|permerror)\b",
        header_text
    )

    if dkim_match:
        result["dkim"] = dkim_match.group(1)

    # -------------------------------------------------
    # DMARC
    # -------------------------------------------------

    dmarc_match = re.search(
        r"\bdmarc=(pass|fail|bestguesspass|none|temperror|permerror)\b",
        header_text
    )

    if dmarc_match:
        result["dmarc"] = dmarc_match.group(1)

    return result


def analyze_authentication(headers: dict) -> dict:
    """
    Analyze SPF, DKIM and DMARC results and
    identify authentication concerns.
    """

    auth = extract_authentication_results(headers)

    findings = []
    risk_points = 0

    # -------------------------------------------------
    # SPF
    # -------------------------------------------------

    if auth["spf"] == "fail":
        findings.append({
            "type": "SPF",
            "status": "fail",
            "severity": "high",
            "message": "SPF authentication failed."
        })

        risk_points += 25

    elif auth["spf"] == "softfail":
        findings.append({
            "type": "SPF",
            "status": "softfail",
            "severity": "medium",
            "message": "SPF softfail detected."
        })

        risk_points += 15

    # -------------------------------------------------
    # DKIM
    # -------------------------------------------------

    if auth["dkim"] == "fail":
        findings.append({
            "type": "DKIM",
            "status": "fail",
            "severity": "high",
            "message": "DKIM authentication failed."
        })

        risk_points += 25

    # -------------------------------------------------
    # DMARC
    # -------------------------------------------------

    if auth["dmarc"] == "fail":
        findings.append({
            "type": "DMARC",
            "status": "fail",
            "severity": "high",
            "message": "DMARC authentication failed."
        })

        risk_points += 30

    # -------------------------------------------------
    # Determine authentication status
    # -------------------------------------------------

    if risk_points >= 50:
        status = "suspicious"

    elif risk_points > 0:
        status = "warning"

    elif all(
        auth[x] == "pass"
        for x in ["spf", "dkim", "dmarc"]
    ):
        status = "authenticated"

    else:
        status = "unknown"

    return {
        "authentication": auth,
        "status": status,
        "risk_points": min(risk_points, 100),
        "findings": findings
    }
import re


def extract_iocs(email_data: dict) -> dict:
    """
    Extract Indicators of Compromise (IOCs)
    from a parsed email.
    """

    subject = email_data.get("subject", "")
    body = email_data.get("body", "")
    sender = email_data.get("sender", "")

    text = f"{subject}\n{body}\n{sender}"

    # -------------------------------------------------
    # Extract URLs
    # -------------------------------------------------

    urls = re.findall(
        r"https?://[^\s<>\"]+",
        text
    )

    # Remove duplicates
    urls = list(dict.fromkeys(urls))

    # -------------------------------------------------
    # Extract IP addresses
    # -------------------------------------------------

    ip_pattern = r"\b(?:\d{1,3}\.){3}\d{1,3}\b"

    ip_addresses = re.findall(
        ip_pattern,
        text
    )

    ip_addresses = list(dict.fromkeys(ip_addresses))

    # -------------------------------------------------
    # Extract email addresses
    # -------------------------------------------------

    email_pattern = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"

    email_addresses = re.findall(
        email_pattern,
        text
    )

    email_addresses = list(dict.fromkeys(email_addresses))

    # -------------------------------------------------
    # Extract domains from URLs
    # -------------------------------------------------

    domains = []

    for url in urls:
        match = re.search(
            r"https?://([^/]+)",
            url
        )

        if match:
            domain = match.group(1).split(":")[0]

            if domain not in domains:
                domains.append(domain)

    # -------------------------------------------------
    # Return IOC results
    # -------------------------------------------------

    return {
        "urls": urls,
        "domains": domains,
        "ip_addresses": ip_addresses,
        "email_addresses": email_addresses,
    }
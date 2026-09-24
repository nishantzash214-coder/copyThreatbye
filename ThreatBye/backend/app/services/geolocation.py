import ipaddress


def is_valid_ip(ip: str) -> bool:
    """
    Check whether the supplied value is a valid IP address.
    """

    try:
        ipaddress.ip_address(ip)
        return True

    except ValueError:
        return False


def classify_ip(ip: str) -> str:
    """
    Classify an IP address as public, private, loopback,
    or invalid.
    """

    try:
        address = ipaddress.ip_address(ip)

        if address.is_loopback:
            return "loopback"

        if address.is_private:
            return "private"

        if address.is_reserved:
            return "reserved"

        if address.is_multicast:
            return "multicast"

        return "public"

    except ValueError:
        return "invalid"


def analyze_ip(ip: str) -> dict:
    """
    Prepare an IP address for geolocation and
    threat-intelligence analysis.
    """

    ip_type = classify_ip(ip)

    result = {
        "ip": ip,
        "valid": is_valid_ip(ip),
        "type": ip_type,
        "country": None,
        "region": None,
        "city": None,
        "latitude": None,
        "longitude": None,
        "asn": None,
        "organization": None,
    }

    # Only public IPs can normally be enriched
    # with meaningful external geolocation data.
    if ip_type != "public":
        result["message"] = (
            "Geolocation enrichment is not applicable "
            "to this IP type."
        )

    else:
        result["message"] = (
            "Public IP detected. External geolocation "
            "enrichment can be performed."
        )

    return result


def analyze_ip_addresses(ip_addresses: list[str]) -> dict:
    """
    Analyze all IP addresses extracted from an email.
    """

    results = []

    for ip in ip_addresses:
        results.append(analyze_ip(ip))

    return {
        "total_ips": len(ip_addresses),
        "results": results,
        "geolocation_provider": {
            "status": "not_connected",
            "message": (
                "External IP geolocation will be "
                "integrated in a later stage."
            )
        }
    }
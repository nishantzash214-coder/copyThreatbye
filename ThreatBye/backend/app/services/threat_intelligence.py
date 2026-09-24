import os
import base64
from urllib.parse import urlparse

import requests
from dotenv import load_dotenv


load_dotenv()


VIRUSTOTAL_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")

VT_BASE_URL = "https://www.virustotal.com/api/v3"


def get_vt_headers():
    """
    Create headers for VirusTotal API requests.
    """

    return {
        "x-apikey": VIRUSTOTAL_API_KEY
    }


def analyze_url(url: str) -> dict:
    """
    Perform basic local analysis of a URL.
    """

    try:
        parsed = urlparse(url)

        domain = parsed.netloc

        # Remove port if present
        domain = domain.split(":")[0]

        return {
            "url": url,
            "domain": domain,
            "scheme": parsed.scheme,
            "path": parsed.path,
            "has_https": parsed.scheme.lower() == "https",
        }

    except Exception:
        return {
            "url": url,
            "domain": None,
            "scheme": None,
            "path": None,
            "has_https": False,
        }


def encode_url_for_virustotal(url: str) -> str:
    """
    Encode a URL into the VirusTotal URL object ID.
    """

    encoded = base64.urlsafe_b64encode(
        url.encode()
    ).decode().strip("=")

    return encoded


def analyze_url_with_virustotal(url: str) -> dict:
    """
    Check a URL against VirusTotal.
    """

    if not VIRUSTOTAL_API_KEY:
        return {
            "url": url,
            "status": "not_configured",
            "message": "VirusTotal API key is not configured."
        }

    try:
        url_id = encode_url_for_virustotal(url)

        response = requests.get(
            f"{VT_BASE_URL}/urls/{url_id}",
            headers=get_vt_headers(),
            timeout=15
        )

        if response.status_code == 404:
            return {
                "url": url,
                "status": "not_found",
                "message": "URL was not found in VirusTotal."
            }

        if response.status_code == 401:
            return {
                "url": url,
                "status": "authentication_error",
                "message": "VirusTotal API key is invalid."
            }

        if response.status_code == 429:
            return {
                "url": url,
                "status": "rate_limited",
                "message": "VirusTotal API rate limit reached."
            }

        response.raise_for_status()

        data = response.json()

        attributes = (
            data.get("data", {})
            .get("attributes", {})
        )

        stats = attributes.get(
            "last_analysis_stats",
            {}
        )

        return {
            "url": url,
            "status": "success",
            "reputation": attributes.get("reputation"),
            "analysis_stats": stats,
            "malicious": stats.get("malicious", 0),
            "suspicious": stats.get("suspicious", 0),
            "harmless": stats.get("harmless", 0),
            "undetected": stats.get("undetected", 0),
        }

    except requests.RequestException as error:
        return {
            "url": url,
            "status": "error",
            "message": str(error)
        }


def analyze_domain_with_virustotal(domain: str) -> dict:
    """
    Check a domain against VirusTotal.
    """

    if not VIRUSTOTAL_API_KEY:
        return {
            "domain": domain,
            "status": "not_configured"
        }

    try:
        response = requests.get(
            f"{VT_BASE_URL}/domains/{domain}",
            headers=get_vt_headers(),
            timeout=15
        )

        if response.status_code == 404:
            return {
                "domain": domain,
                "status": "not_found"
            }

        if response.status_code == 401:
            return {
                "domain": domain,
                "status": "authentication_error"
            }

        if response.status_code == 429:
            return {
                "domain": domain,
                "status": "rate_limited"
            }

        response.raise_for_status()

        data = response.json()

        attributes = (
            data.get("data", {})
            .get("attributes", {})
        )

        stats = attributes.get(
            "last_analysis_stats",
            {}
        )

        return {
            "domain": domain,
            "status": "success",
            "reputation": attributes.get("reputation"),
            "analysis_stats": stats,
            "malicious": stats.get("malicious", 0),
            "suspicious": stats.get("suspicious", 0),
            "harmless": stats.get("harmless", 0),
            "undetected": stats.get("undetected", 0),
        }

    except requests.RequestException as error:
        return {
            "domain": domain,
            "status": "error",
            "message": str(error)
        }


def analyze_ip_with_virustotal(ip_address: str) -> dict:
    """
    Check an IP address against VirusTotal.
    """

    if not VIRUSTOTAL_API_KEY:
        return {
            "ip_address": ip_address,
            "status": "not_configured"
        }

    try:
        response = requests.get(
            f"{VT_BASE_URL}/ip_addresses/{ip_address}",
            headers=get_vt_headers(),
            timeout=15
        )

        if response.status_code == 404:
            return {
                "ip_address": ip_address,
                "status": "not_found"
            }

        if response.status_code == 401:
            return {
                "ip_address": ip_address,
                "status": "authentication_error"
            }

        if response.status_code == 429:
            return {
                "ip_address": ip_address,
                "status": "rate_limited"
            }

        response.raise_for_status()

        data = response.json()

        attributes = (
            data.get("data", {})
            .get("attributes", {})
        )

        stats = attributes.get(
            "last_analysis_stats",
            {}
        )

        return {
            "ip_address": ip_address,
            "status": "success",
            "country": attributes.get("country"),
            "as_owner": attributes.get("as_owner"),
            "reputation": attributes.get("reputation"),
            "analysis_stats": stats,
            "malicious": stats.get("malicious", 0),
            "suspicious": stats.get("suspicious", 0),
            "harmless": stats.get("harmless", 0),
            "undetected": stats.get("undetected", 0),
        }

    except requests.RequestException as error:
        return {
            "ip_address": ip_address,
            "status": "error",
            "message": str(error)
        }


def analyze_iocs(iocs: dict) -> dict:
    """
    Analyze extracted IOCs using local analysis
    and VirusTotal.
    """

    urls = iocs.get("urls", [])
    domains = iocs.get("domains", [])
    ip_addresses = iocs.get("ip_addresses", [])

    # Local URL analysis
    url_analysis = []

    for url in urls:
        url_analysis.append(
            analyze_url(url)
        )

    # VirusTotal URL analysis
    virustotal_urls = []

    for url in urls:
        virustotal_urls.append(
            analyze_url_with_virustotal(url)
        )

    # VirusTotal domain analysis
    virustotal_domains = []

    for domain in domains:
        virustotal_domains.append(
            analyze_domain_with_virustotal(domain)
        )

    # VirusTotal IP analysis
    virustotal_ips = []

    for ip_address in ip_addresses:
        virustotal_ips.append(
            analyze_ip_with_virustotal(ip_address)
        )

    return {
        "urls_analyzed": url_analysis,

        "domains": domains,

        "ip_addresses": ip_addresses,

        "total_urls": len(urls),

        "total_domains": len(domains),

        "total_ip_addresses": len(ip_addresses),

        "external_intelligence": {
            "provider": "VirusTotal",
            "status": "connected",
            "urls": virustotal_urls,
            "domains": virustotal_domains,
            "ip_addresses": virustotal_ips
        }
    }
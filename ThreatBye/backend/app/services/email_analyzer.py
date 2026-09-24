from app.services.email_parser import parse_email
from app.services.threat_detector import detect_threat
from app.services.ioc_extractor import extract_iocs
from app.services.risk_scorer import calculate_risk_score
from app.services.report_generator import generate_report
from app.services.threat_intelligence import analyze_iocs
from app.services.authentication_analyzer import analyze_authentication
from app.services.geolocation import analyze_ip_addresses
from app.ml.predictor import predict_email
from app.services.forensic_service import generate_forensic_report
from app.services.evillocker_service import store_forensic_report


def analyze_email(
    file_bytes: bytes,
    filename: str = "gmail_email.eml"
):
    """
    Run an email through the complete ThreatBye analysis pipeline.
    """

    parsed_email = parse_email(file_bytes)

    ml_prediction = predict_email(
        f"{parsed_email.get('subject', '')} "
        f"{parsed_email.get('body', '')}"
    )

    ioc_data = extract_iocs(parsed_email)

    geolocation = analyze_ip_addresses(
        ioc_data.get("ip_addresses", [])
    )

    threat_intelligence = analyze_iocs(ioc_data)

    authentication = analyze_authentication(
        parsed_email.get("headers", {})
    )

    threat_analysis = detect_threat(parsed_email)

    risk_analysis = calculate_risk_score(
        threat_analysis,
        ioc_data,
        authentication,
        threat_intelligence,
        ml_prediction
    )

    forensic_report = generate_forensic_report(
        filename=filename,
        parsed_email=parsed_email,
        ioc_data=ioc_data,
        authentication=authentication,
        threat_intelligence=threat_intelligence,
        geolocation=geolocation,
        ml_prediction=ml_prediction,
        risk_analysis=risk_analysis
    )

    evidence = store_forensic_report(
        forensic_report
    )

    report = generate_report(
        parsed_email,
        ioc_data,
        threat_analysis,
        risk_analysis
    )

    return {
        "message": "Email analyzed successfully",
        "filename": filename,
        "report": report,
        "ml_prediction": ml_prediction,
        "threat_intelligence": threat_intelligence,
        "authentication": authentication,
        "geolocation": geolocation,
        "risk_analysis": risk_analysis,
        "forensic_report": forensic_report,
        "evidence": evidence
    }
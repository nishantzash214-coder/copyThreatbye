from fastapi import APIRouter, HTTPException
from googleapiclient.discovery import build

from app.services.google_auth import (
    get_google_authorization_url,
    exchange_code_for_credentials,
    get_google_credentials
)

from app.services.gmail_service import (
    get_gmail_messages as fetch_gmail_messages,
    get_gmail_message_raw
)

from app.services.email_analyzer import analyze_email


router = APIRouter(
    prefix="/gmail",
    tags=["Gmail"]
)


@router.get("/status")
def gmail_status():
    """
    Check whether Gmail integration is available.
    """

    return {
        "status": "ready",
        "message": "Gmail integration module is working."
    }


@router.get("/login")
def gmail_login():
    """
    Start Google OAuth login.
    """

    authorization_url, state = get_google_authorization_url()

    return {
        "authorization_url": authorization_url,
        "state": state
    }


@router.get("/callback")
def gmail_callback(
    code: str,
    state: str
):
    """
    Receive Google's OAuth callback.
    """

    try:
        credentials = exchange_code_for_credentials(
            code,
            state
        )

        return {
            "success": True,
            "message": "Google authentication successful."
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/messages")
def get_gmail_messages(max_results: int = 10):
    """
    Fetch recent Gmail messages.
    """

    credentials = get_google_credentials()

    if not credentials:
        raise HTTPException(
            status_code=401,
            detail="Gmail is not authenticated. Please use /gmail/login first."
        )

    try:
        gmail_service = build(
            "gmail",
            "v1",
            credentials=credentials
        )

        response = gmail_service.users().messages().list(
            userId="me",
            maxResults=max_results
        ).execute()

        messages = response.get("messages", [])

        results = []

        for message in messages:
            message_data = gmail_service.users().messages().get(
                userId="me",
                id=message["id"],
                format="metadata",
                metadataHeaders=[
                    "From",
                    "To",
                    "Subject",
                    "Date"
                ]
            ).execute()

            headers = message_data.get("payload", {}).get("headers", [])

            email = {}

            for header in headers:
                name = header["name"].lower()

                if name == "from":
                    email["from"] = header["value"]

                elif name == "to":
                    email["to"] = header["value"]

                elif name == "subject":
                    email["subject"] = header["value"]

                elif name == "date":
                    email["date"] = header["value"]

            email["id"] = message_data["id"]
            email["snippet"] = message_data.get("snippet", "")

            results.append(email)

        return {
            "success": True,
            "count": len(results),
            "messages": results
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/messages/{message_id}")
def get_gmail_message(message_id: str):
    """
    Fetch a complete Gmail message by ID.
    """

    credentials = get_google_credentials()

    if not credentials:
        raise HTTPException(
            status_code=401,
            detail="Gmail is not authenticated. Please use /gmail/login first."
        )

    try:
        gmail_service = build(
            "gmail",
            "v1",
            credentials=credentials
        )

        message = gmail_service.users().messages().get(
            userId="me",
            id=message_id,
            format="full"
        ).execute()

        return {
            "success": True,
            "message": message
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/analyze/{message_id}")
def analyze_gmail_message(message_id: str):
    """
    Fetch a Gmail message and analyze it with ThreatBye.
    """

    try:
        email_bytes = get_gmail_message_raw(message_id)

        result = analyze_email(
            file_bytes=email_bytes,
            filename=f"gmail_{message_id}.eml"
        )

        return result

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to analyze Gmail message: {error}"
        )
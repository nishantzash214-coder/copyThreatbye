import base64
import json
import os

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build


SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly"
]


def get_gmail_service():
    """
    Create an authenticated Gmail API service using token.json.
    """

    token_path = os.path.join(
        os.path.dirname(
            os.path.dirname(
                os.path.dirname(__file__)
            )
        ),
        "token.json"
    )

    if not os.path.exists(token_path):
        raise FileNotFoundError(
            "token.json not found. Please authenticate with Google first."
        )

    with open(token_path, "r", encoding="utf-8") as file:
        token_data = json.load(file)

    credentials = Credentials.from_authorized_user_info(
        token_data,
        SCOPES
    )

    service = build(
        "gmail",
        "v1",
        credentials=credentials
    )

    return service


def get_gmail_messages(max_results=10):
    """
    Get recent Gmail message IDs.
    """

    service = get_gmail_service()

    response = service.users().messages().list(
        userId="me",
        maxResults=max_results
    ).execute()

    return response.get("messages", [])


def get_gmail_message_raw(message_id: str):
    """
    Download a complete Gmail message in RAW format.
    Returns .eml-compatible bytes.
    """

    service = get_gmail_service()

    message = service.users().messages().get(
        userId="me",
        id=message_id,
        format="raw"
    ).execute()

    raw_message = message["raw"]

    email_bytes = base64.urlsafe_b64decode(
        raw_message + "=" * (-len(raw_message) % 4)
    )

    return email_bytes
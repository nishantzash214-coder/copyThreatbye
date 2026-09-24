import os
import json

from dotenv import load_dotenv
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials


load_dotenv()


GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")


SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly"
]

code_verifiers = {}

TOKEN_FILE = "token.json"


def create_google_flow():
    """
    Create the Google OAuth flow for ThreatBye.
    """

    client_config = {
        "web": {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": [
                GOOGLE_REDIRECT_URI
            ]
        }
    }

    flow = Flow.from_client_config(
        client_config,
        scopes=SCOPES,
        redirect_uri=GOOGLE_REDIRECT_URI
    )

    return flow


def get_google_authorization_url():
    """
    Generate the Google login/authorization URL.
    """

    flow = create_google_flow()

    authorization_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent"
    )

    code_verifiers[state] = flow.code_verifier

    return authorization_url, state


def exchange_code_for_credentials(code: str, state: str):
    """
    Exchange Google's authorization code for credentials.
    """

    code_verifier = code_verifiers.pop(state, None)

    if not code_verifier:
        raise ValueError(
            "OAuth code verifier not found. Please start the login again."
        )

    flow = create_google_flow()

    flow.fetch_token(
        code=code,
        code_verifier=code_verifier
    )

    credentials = flow.credentials

    # Save credentials for Gmail API requests
    with open(TOKEN_FILE, "w") as token:
        token.write(credentials.to_json())

    return credentials


def get_google_credentials():
    """
    Load saved Google credentials.
    """

    if not os.path.exists(TOKEN_FILE):
        return None

    with open(TOKEN_FILE, "r") as token:
        token_data = json.load(token)

    credentials = Credentials.from_authorized_user_info(
        token_data,
        SCOPES
    )

    # Refresh expired credentials automatically
    if credentials.expired and credentials.refresh_token:
        from google.auth.transport.requests import Request

        credentials.refresh(Request())

        with open(TOKEN_FILE, "w") as token:
            token.write(credentials.to_json())

    return credentials
from email import policy
from email.parser import BytesParser
from email.message import Message
from typing import Any
import re


def extract_body(message: Message) -> str:
    """Extract readable text from an email."""

    if message.is_multipart():
        for part in message.walk():
            content_type = part.get_content_type()

            if content_type == "text/plain":
                try:
                    return part.get_content()
                except Exception:
                    payload = part.get_payload(decode=True)
                    if payload:
                        return payload.decode(
                            part.get_content_charset() or "utf-8",
                            errors="replace"
                        )

    else:
        try:
            return message.get_content()
        except Exception:
            pass

    return ""


def extract_urls(text: str) -> list[str]:
    """Extract URLs from email text."""

    url_pattern = r"https?://[^\s<>\"']+"
    return re.findall(url_pattern, text)


def parse_email(file_bytes: bytes) -> dict[str, Any]:
    """Parse an .eml email and extract useful evidence."""

    message = BytesParser(policy=policy.default).parsebytes(file_bytes)

    body = extract_body(message)

    headers = {
        key: value
        for key, value in message.items()
    }

    return {
        "sender": message.get("From", ""),
        "receiver": message.get("To", ""),
        "subject": message.get("Subject", ""),
        "date": message.get("Date", ""),
        "message_id": message.get("Message-ID", ""),
        "body": body,
        "urls": extract_urls(body),
        "headers": headers,
    }
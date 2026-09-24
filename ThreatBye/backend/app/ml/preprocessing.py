import re


def clean_text(text: str) -> str:
    """
    Clean email text before ML analysis.
    """

    if not text:
        return ""

    # Convert to lowercase
    text = text.lower()

    # Remove URLs
    text = re.sub(
        r"https?://\S+",
        " URL ",
        text
    )

    # Remove email addresses
    text = re.sub(
        r"\b[\w.+-]+@[\w.-]+\.\w+\b",
        " EMAIL ",
        text
    )

    # Remove extra whitespace
    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


def extract_features(email_data: dict) -> dict:
    """
    Extract numerical and text features from
    parsed email data.
    """

    subject = email_data.get("subject", "")
    body = email_data.get("body", "")
    sender = email_data.get("sender", "")

    cleaned_subject = clean_text(subject)
    cleaned_body = clean_text(body)

    full_text = f"{cleaned_subject} {cleaned_body}"

    # Basic numerical features
    features = {
        "subject_length": len(cleaned_subject),
        "body_length": len(cleaned_body),
        "url_count": len(
            re.findall(
                r"https?://\S+",
                body
            )
        ),
        "exclamation_count": full_text.count("!"),
        "question_count": full_text.count("?"),
        "uppercase_count": sum(
            1 for char in subject + body
            if char.isupper()
        ),
        "urgent_word_present": int(
            any(
                word in full_text
                for word in [
                    "urgent",
                    "immediately",
                    "action required",
                    "verify",
                    "suspended"
                ]
            )
        ),
        "sender_present": int(bool(sender)),
    }

    return {
        "cleaned_subject": cleaned_subject,
        "cleaned_body": cleaned_body,
        "features": features
    }
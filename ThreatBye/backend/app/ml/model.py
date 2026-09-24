from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression


# Small starter dataset for testing the ML pipeline.
# Later, replace this with a proper phishing-email dataset.
TRAINING_EMAILS = [
    "hello how are you today",
    "meeting scheduled for tomorrow",
    "please find the project report attached",
    "your invoice for this month is ready",
    "thank you for your message",
    "team meeting at 10 am",
    
    "urgent verify your account immediately",
    "your account has been suspended click here",
    "confirm your password immediately",
    "security alert verify your account",
    "your payment failed update your information",
    "click here to reset your password",
]

# 0 = benign
# 1 = suspicious
TRAINING_LABELS = [
    0,
    0,
    0,
    0,
    0,
    0,
    
    1,
    1,
    1,
    1,
    1,
    1,
]


def train_model():
    """
    Train the starter email classification model.
    """

    vectorizer = TfidfVectorizer(
        lowercase=True,
        stop_words="english"
    )

    X = vectorizer.fit_transform(TRAINING_EMAILS)

    model = LogisticRegression(
        max_iter=1000
    )

    model.fit(X, TRAINING_LABELS)

    return model, vectorizer
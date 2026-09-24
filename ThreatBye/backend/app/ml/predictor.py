from app.ml.model import train_model


# Train the model once when this module loads
model, vectorizer = train_model()


def predict_email(email_text: str):
    """
    Predict whether an email is benign or suspicious.
    """

    # Convert email text into the same numerical format
    # used during training.
    email_vector = vectorizer.transform([email_text])

    # Make prediction
    prediction = model.predict(email_vector)[0]

    # Get probability/confidence
    probabilities = model.predict_proba(email_vector)[0]
    confidence = max(probabilities)

    if prediction == 1:
        label = "suspicious"
    else:
        label = "benign"

    return {
        "label": label,
        "confidence": round(float(confidence), 4)
    }
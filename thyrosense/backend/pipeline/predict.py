"""Prediction pipeline — called by the FastAPI /predict endpoint."""


def preprocess(input_dict: dict) -> object:
    """Convert raw patient input dict into a model-ready numpy array.

    TODO: implement feature extraction, encoding, and scaling to match
          the transformations applied during training.
    """
    pass


def predict(input_dict: dict) -> dict:
    """Load the trained model and return class label + confidence.

    TODO: load model from backend/model/, run inference, return
          {'predicted_class': str, 'confidence': float}.
    """
    pass


def get_shap_values(model, input_array) -> list:
    """Compute SHAP feature-importance values for a single prediction.

    TODO: initialise a shap.TreeExplainer, call shap_values(input_array),
          and return the top-N feature/value pairs as a list of dicts.
    """
    pass


def get_cluster(input_array) -> int:
    """Return the KMeans cluster ID for the given input sample.

    TODO: load the fitted KMeans model and call predict(input_array).
    """
    pass

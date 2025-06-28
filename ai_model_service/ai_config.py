# ai_model_service/ai_config.py

import numpy as np

# This is our shared configuration for the AI model.
# Both train.py and ai_model_service.py will import from THIS file.

RISK_MAPPING = {
    "yes": 1, "no": 0,
    "low": 0.2, "medium": 0.5, "high": 0.9,
    # Add more specific mappings for new questions if needed
    "idea": 0.9, "prototype": 0.6, "mvp": 0.4, "growth": 0.2,
    "pre-seed": 0.9, "seed": 0.6, "series-a": 0.3,
    "0-1": 0.8, "2-5": 0.5, "6+": 0.3,
}

# The order is critical for the model.
# NOTE: 'industry' is NOT included here because it's for benchmarking, not for risk calculation.
FEATURE_ORDER = [
    # Market Risk
    'marketNeed', 'competition', 'marketTrends', 'customerAcquisitionCost',
    # Financial Risk
    'capital', 'burnRate', 'revenueModel', 'profitabilityTimeline',
    # Product Risk
    'productQuality', 'devDelays', 'techObsolescence', 'scalability',
    # Team Risk
    'founderConflicts', 'hiring', 'skillGaps', 'founderExperience',
]

def preprocess_answers(answers):
    """Converts a dictionary of answers into a numerical numpy array."""
    numerical_features = []
    for feature_key in FEATURE_ORDER:
        # Default to "no" if a question wasn't answered
        answer = answers.get(feature_key, "no").lower()
        # Default to 0 if the answer isn't in our mapping
        numerical_value = RISK_MAPPING.get(answer, 0)
        numerical_features.append(numerical_value)
    return np.array(numerical_features)
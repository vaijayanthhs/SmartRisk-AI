# ai_model_service/ai_model_service.py

import os
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from sklearn.preprocessing import StandardScaler
from ai_config import preprocess_answers

app = Flask(__name__)

# --- Load Model and Scaler ---
model = None
scaler = None
try:
    print("Loading AI model and scaler...")
    model = tf.keras.models.load_model('risk_model.h5')
    scaler_state = np.load('scaler.npy', allow_pickle=True).item()
    scaler = StandardScaler()
    scaler.mean_ = scaler_state['mean']
    scaler.scale_ = scaler_state['scale']
    print(">>> Model and scaler loaded successfully. API is ready. <<<")
except Exception as e:
    print("="*60)
    print(f"WARNING: Could not load model/scaler. API will not work. Error: {e}")
    print("="*60)

# --- Suggestion Engine with Resource Links ---
SUGGESTION_MAPPING = {
    'marketNeed': {'high': {'text': 'Your highest risk is unproven market need. Start customer discovery interviews to validate the problem.', 'resourceKey': 'customer-discovery'}},
    'competition': {'high': {'text': 'You are entering a saturated market. Clearly define your unique value proposition and find an underserved niche.', 'resourceKey': 'usp'}},
    'customerAcquisitionCost': {'high': {'text': 'A high CAC can drain capital. Focus on organic marketing and referral programs to lower this cost.', 'resourceKey': None}},
    'capital': {'high': {'text': 'Lack of capital is a primary startup killer. Create a detailed financial model and start investor conversations now.', 'resourceKey': None}},
    'burnRate': {'high': {'text': 'Your burn rate is dangerously high. Immediately review all expenses and cut non-essentials to extend your runway.', 'resourceKey': None}},
    'revenueModel': {'high': {'text': 'Your revenue model is unclear. Analyze competitors and survey potential customers to find the best pricing strategy.', 'resourceKey': None}},
    'productQuality': {'low': {'text': 'Low product quality prevents adoption. Focus on a smaller, more polished MVP rather than a wide array of buggy features.', 'resourceKey': None}},
    'techObsolescence': {'high': {'text': 'Relying on rapidly changing technology is risky. Ensure your architecture is modular to allow for future changes.', 'resourceKey': None}},
    'founderConflicts': {'high': {'text': "Founder conflict is a top reason for failure. Establish a formal founders' agreement outlining roles, equity, and dispute resolution.", 'resourceKey': 'founder-agreement'}},
    'skillGaps': {'high': {'text': 'Your team has critical skill gaps. Prioritize hiring or bringing on advisors to fill these, especially in marketing or sales.', 'resourceKey': None}},
}

def generate_suggestions(answers):
    suggestions = []
    for feature, answer in answers.items():
        answer = str(answer).lower()
        if feature in SUGGESTION_MAPPING:
            risk_level_map = SUGGESTION_MAPPING[feature]
            if answer in risk_level_map:
                suggestions.append(risk_level_map[answer])

    if not suggestions:
        suggestions.append({'text': "Your risk profile appears balanced. Continue to monitor all aspects of your venture, especially customer feedback and financial runway.", 'resourceKey': None})
    return suggestions

# --- API Endpoint for Prediction ---
@app.route("/predict_risk", methods=["POST"])
def predict():
    if model is None or scaler is None:
        return jsonify({"error": "AI model is not available. Please train the model."}), 503

    try:
        data = request.get_json(force=True)
        answers = data['answers']
        
        numerical_data = preprocess_answers(answers).reshape(1, -1)
        scaled_data = scaler.transform(numerical_data)
        predictions = model.predict(scaled_data)[0]
        overall_score = float(np.mean(predictions))
        
        risk_level = "Low"
        if overall_score > 0.66: risk_level = "High"
        elif overall_score > 0.33: risk_level = "Medium"

        risk_profile = {
            "overallScore": overall_score,
            "riskLevel": risk_level,
            "riskBreakdown": {
                "marketRisk": float(predictions[0]),
                "financialRisk": float(predictions[1]),
                "productRisk": float(predictions[2]),
                "teamRisk": float(predictions[3]),
            },
            "suggestions": generate_suggestions(answers)
        }
        return jsonify(risk_profile)
    except Exception as e:
        return jsonify({"error": f"An error occurred during prediction: {str(e)}"}), 400
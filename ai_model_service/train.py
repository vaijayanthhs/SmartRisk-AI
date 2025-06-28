# File: ai_model_service/train.py

import os
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import StandardScaler
from pymongo import MongoClient
from ai_config import preprocess_answers, FEATURE_ORDER, RISK_MAPPING

# --- Configuration ---
MONGO_CONNECTION_STRING = "mongodb+srv://db_nithin:neethu@cluster0.bjm6zyj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = "test"
COLLECTION_NAME = "questionnaires"

NUM_RISK_CATEGORIES = 4
LEARNING_RATE = 0.001 

def calculate_manual_risk(answers):
    """
    A simple rule-based engine to create non-zero risk profiles for seeding.
    This helps the model learn a meaningful baseline.
    This function is CRITICAL because it generates the "ground truth" for training.
    """
    market_answers = [answers.get('marketNeed', 'low'), answers.get('competition', 'low'), answers.get('marketTrends', 'yes'), answers.get('customerAcquisitionCost', 'low')]
    financial_answers = [answers.get('capital', 'low'), answers.get('burnRate', 'low'), answers.get('revenueModel', 'low'), answers.get('profitabilityTimeline', 'low')]
    product_answers = [answers.get('productQuality', 'high'), answers.get('devDelays', 'no'), answers.get('techObsolescence', 'low'), answers.get('scalability', 'yes')]
    team_answers = [answers.get('founderConflicts', 'low'), answers.get('hiring', 'low'), answers.get('skillGaps', 'low'), answers.get('founderExperience', 'yes')]

    # Calculate the mean risk for each category based on the mappings
    market_risk = np.mean([RISK_MAPPING.get(str(a).lower(), 0) for a in market_answers])
    financial_risk = np.mean([RISK_MAPPING.get(str(a).lower(), 0) for a in financial_answers])
    product_risk = np.mean([RISK_MAPPING.get(str(a).lower(), 0) for a in product_answers])
    team_risk = np.mean([RISK_MAPPING.get(str(a).lower(), 0) for a in team_answers])
    
    return [market_risk, financial_risk, product_risk, team_risk]


def train_the_model():
    """
    Connects to MongoDB, trains the model with a better seeding strategy,
    and saves the final model and scaler.
    """
    try:
        print("Connecting to MongoDB Atlas...")
        client = MongoClient(MONGO_CONNECTION_STRING)
        db = client[DATABASE_NAME]
        # We only want to train on documents that actually have answers
        all_questionnaires = list(db[COLLECTION_NAME].find({ "answers": { "$exists": True } }))
        print(f"Successfully connected and found {len(all_questionnaires)} documents with 'answers'.")
    except Exception as e:
        print(f"ERROR: Could not connect to MongoDB Atlas. \n{e}")
        return

    if len(all_questionnaires) < 2:
        print("\nERROR: Not enough data to train. Please use the web app to submit at least 2 varied assessments first.")
        return

    X_train_raw, y_train_raw = [], []
    print("\n--- Generating Training Data ---")
    print("This script IGNORES any 'riskProfile' already in the database.")
    print("It RE-CALCULATES the correct risk profile from the raw 'answers' to create a reliable training set.")
    
    for doc in all_questionnaires:
        if 'answers' in doc and isinstance(doc['answers'], dict):
            answers = doc['answers']
            # Create the input features (X)
            X_train_raw.append(preprocess_answers(answers))
            
            # Create the target labels (Y) using our reliable rule-based engine
            # This ensures our training data is NOT all zeros.
            manual_y = calculate_manual_risk(answers)
            y_train_raw.append(manual_y)
            print(f"  - Processed doc '{doc['_id']}': Generated Target Risk Profile -> {np.round(manual_y, 2)}")
        else:
            print(f"  - Skipped doc '{doc['_id']}' due to missing or invalid 'answers' field.")


    if len(X_train_raw) < 2:
        print("\nCould not find enough valid documents to create a training set.")
        return

    print(f"\nCreated a valid training set with {len(X_train_raw)} entries.")

    X_train = np.array(X_train_raw)
    y_train = np.array(y_train_raw)
    
    # Scale the input features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    print("\nFeature data has been scaled.")
    print(f"Sample of scaled data: {np.round(X_train_scaled[0], 2)}")

    # Define the model
    model = tf.keras.models.Sequential([
        tf.keras.layers.Dense(32, activation='relu', input_shape=[len(FEATURE_ORDER)]),
        tf.keras.layers.Dense(16, activation='relu'),
        tf.keras.layers.Dense(NUM_RISK_CATEGORIES, activation='sigmoid') # Sigmoid is good for 0-1 risk range
    ])
    
    # Compile the model with an optimizer and loss function
    optimizer = tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE)
    model.compile(optimizer=optimizer, loss='mean_squared_error')
    
    print(f"\n--- Starting model training with learning rate {LEARNING_RATE}... ---")
    # Increased epochs slightly for better learning
    model.fit(X_train_scaled, y_train, epochs=150, verbose=1, batch_size=1) 
    print("--- Model training complete. ---")

    # Save the trained model
    print("\nSaving new model to 'risk_model.h5'...")
    model.save('risk_model.h5')
    
    # Save the scaler's state so we can reuse it for predictions
    print("Saving new scaler state to 'scaler.npy'...")
    scaler_state = {'mean': scaler.mean_, 'scale': scaler.scale_}
    np.save('scaler.npy', scaler_state, allow_pickle=True)

    print("\n\nSUCCESS: 'risk_model.h5' and 'scaler.npy' have been created.")
    print("You may now restart the Python Flask server and the Node.js server.")

if __name__ == "__main__":
    train_the_model()
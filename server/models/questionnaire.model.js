// File: node_server/models/questionnaire.model.js

import mongoose from 'mongoose';

const questionnaireSchema = new mongoose.Schema(
  {
    // Link to the user who submitted it
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // This should reference the 'User' model
      required: true,
    },
    // Store the raw answers from the form
    answers: {
      type: Object,
      required: true,
    },
    // Store the risk profile calculated by the Python service
    riskProfile: {
      type: Object,
      required: true,
    },
  },
  {
    // --- THIS IS THE IMPORTANT PART ---
    // These options go at the end of the schema definition.
    timestamps: true,
    // Explicitly tell Mongoose which collection to use.
    // Based on Mongoose defaults, your data is already going here.
    collection: 'questionnaires',
  }
);

const Questionnaire = mongoose.model('Questionnaire', questionnaireSchema);
export default Questionnaire;
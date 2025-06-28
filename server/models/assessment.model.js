import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  inputs: {
    fundingStage: { type: String, required: true },
    competition: { type: String, required: true },
    teamSize: { type: String, required: true },
    productStage: { type: String, required: true },
  },
  results: {
    totalScore: { type: Number, required: true },
    riskLevel: { type: String, required: true },
    categoryScores: {
      financial: { type: Number, required: true },
      market: { type: Number, required: true },
      team: { type: Number, required: true },
      product: { type: Number, required: true },
    },
    suggestions: [{ type: String }],
  },
}, {
  timestamps: true,
});

const Assessment = mongoose.model('Assessment', assessmentSchema);
export default Assessment;
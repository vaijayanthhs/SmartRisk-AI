import tf from '@tensorflow/tfjs-node';

let model;
const MODEL_PATH = 'file://./model/model.json';

const allCategories = {
    fundingStage: ['pre-seed', 'seed', 'series-a'],
    competition: ['low', 'medium', 'high'],
    teamSize: ['solo', '2', '3+'],
    productStage: ['idea', 'mvp', 'growth']
};

async function loadModel() {
  try {
    model = await tf.loadLayersModel(MODEL_PATH);
    console.log("AI Model loaded successfully.");
    model.predict(tf.zeros([1, 12])); // Warm up
    console.log("Model warmed up.");
  } catch (error) {
    console.error("Error loading AI model:", error);
    console.log("\n>>> Fallback Notice: AI model not found. Using rule-based engine instead. To use the AI, run 'node train-model.js' first. <<<\n");
    model = null; // Set model to null to indicate fallback
  }
}

function preprocessInputForPrediction(inputs) {
    const encoding = [];
    for (const category of allCategories.fundingStage) encoding.push(inputs.fundingStage === category ? 1 : 0);
    for (const category of allCategories.competition) encoding.push(inputs.competition === category ? 1 : 0);
    for (const category of allCategories.teamSize) encoding.push(inputs.teamSize === category ? 1 : 0);
    for (const category of allCategories.productStage) encoding.push(inputs.productStage === category ? 1 : 0);
    return tf.tensor2d([encoding]);
}

function postprocessOutput(prediction, fallbackData = null) {
    const scores = {};

    if (fallbackData) {
        // We are in fallback mode
        Object.assign(scores, fallbackData.categoryScores);
    } else {
        // We are using the AI model
        const scoresNormalized = prediction.dataSync();
        scores.financial = Math.round(scoresNormalized[0] * 10);
        scores.market = Math.round(scoresNormalized[1] * 10);
        scores.team = Math.round(scoresNormalized[2] * 10);
        scores.product = Math.round(scoresNormalized[3] * 10);
    }

    const suggestions = [];
    if (scores.financial > 7) suggestions.push("High financial risk detected. Focus on developing a strong MVP to demonstrate traction.");
    if (scores.market > 7) suggestions.push("Entering a highly competitive market requires significant differentiation. Clearly articulate your Unique Selling Proposition (USP).");
    if (scores.team > 6) suggestions.push("Solo founders face immense pressure. Consider finding a co-founder with complementary skills.");
    if (scores.product > 7) suggestions.push("The 'idea' stage is the highest risk. Prioritize building a functional MVP to gather real-world user feedback.");

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const maxScore = Object.keys(scores).length * 10;
    const riskPercentage = Math.round((totalScore / maxScore) * 100);

    let riskLevel = "Low";
    if (riskPercentage > 66) riskLevel = "High";
    else if (riskPercentage > 33) riskLevel = "Medium";

    return { totalScore: riskPercentage, riskLevel: riskLevel, categoryScores: scores, suggestions: suggestions };
}


function runRuleBasedEngine(formData) {
    const { fundingStage, competition, teamSize, productStage } = formData;
    const scores = {
      financial: { 'pre-seed': 10, 'seed': 6, 'series-a': 2 }[fundingStage] || 5,
      market: { 'low': 2, 'medium': 6, 'high': 10 }[competition] || 5,
      team: { 'solo': 8, '2': 3, '3+' : 5 }[teamSize] || 5,
      product: { 'idea': 9, 'mvp': 5, 'growth': 2 }[productStage] || 5,
    };
    return postprocessOutput(null, { categoryScores: scores });
}

// Load the model when the server starts
loadModel();

export const predictRisk = async (formData) => {
  if (!model) {
    // Fallback to rule-based engine if model isn't loaded
    return runRuleBasedEngine(formData);
  }

  const inputTensor = preprocessInputForPrediction(formData);
  const predictionTensor = model.predict(inputTensor);
  const result = postprocessOutput(predictionTensor);

  inputTensor.dispose();
  predictionTensor.dispose();
  
  return result;
};
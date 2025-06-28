// File: node_server/routes/assessment.routes.js

import express from 'express';
import axios from 'axios';
import Questionnaire from '../models/questionnaire.model.js';
import { protect } from '../middleware/auth.middleware.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

const router = express.Router();
const TF_SERVICE_URL = 'http://localhost:8000/predict_risk';

// --- BENCHMARKING FUNCTION ---
const getBenchmarkData = async (industry) => {
  try {
    // MongoDB Aggregation Pipeline to calculate average scores
    const benchmark = await Questionnaire.aggregate([
      // Stage 1: Filter documents to only include the specified industry
      { $match: { 'answers.industry': industry } },
      // Stage 2: Group all matching documents together and calculate averages
      {
        $group: {
          _id: '$answers.industry', // Group by industry
          count: { $sum: 1 }, // Count how many startups are in this benchmark
          avgOverall: { $avg: '$riskProfile.overallScore' },
          avgMarket: { $avg: '$riskProfile.riskBreakdown.marketRisk' },
          avgFinancial: { $avg: '$riskProfile.riskBreakdown.financialRisk' },
          avgProduct: { $avg: '$riskProfile.riskBreakdown.productRisk' },
          avgTeam: { $avg: '$riskProfile.riskBreakdown.teamRisk' },
        },
      },
    ]);

    // If we found data, return the first result (there will only be one)
    if (benchmark.length > 0) {
      console.log(`Node.js: Benchmark found for industry '${industry}': ${benchmark[0].count} startups.`);
      return benchmark[0];
    }
    
    // If no data for that industry, return null
    console.log(`Node.js: No benchmark data available for industry '${industry}'.`);
    return null;

  } catch (error) {
    console.error("Error fetching benchmark data:", error);
    return null;
  }
};


router.post(
  '/predict',
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const currentAnswers = req.body.answers;

    if (!currentAnswers) {
      res.status(400);
      throw new Error('No assessment answers provided.');
    }

    // 1. Get the AI-powered risk profile
    let currentRiskProfile;
    try {
      console.log('Node.js: Calling Python AI service...');
      const response = await axios.post(TF_SERVICE_URL, { answers: currentAnswers });
      currentRiskProfile = response.data;
      console.log('Node.js: Successfully received profile from Python.');
    } catch (error) {
      res.status(503);
      throw new Error('AI Analysis Service is currently unavailable. Please ensure it is running and has been trained.');
    }

    // 2. Get historical comparison data
    const previousQuestionnaire = await Questionnaire.findOne({ userId }).sort({ createdAt: -1 });
    const comparison = {};
    if (previousQuestionnaire && previousQuestionnaire.riskProfile?.overallScore) {
      const previousScore = previousQuestionnaire.riskProfile.overallScore;
      const currentScore = currentRiskProfile.overallScore;
      const difference = currentScore - previousScore;
      const percentageChange = Math.abs(Math.round(difference * 100));

      if (difference < -0.005) {
        comparison.message = `Great progress! Your overall risk has decreased by approximately ${percentageChange}% since your last assessment.`;
      } else if (difference > 0.005) {
        comparison.message = `Your overall risk has increased by approximately ${percentageChange}%. Review the suggestions to identify areas for improvement.`;
      } else {
        comparison.message = `Your overall risk profile has remained stable. Continue executing your plan and reassess soon.`;
      }
    } else {
      comparison.message = "This is your first assessment. We will track your progress from now on!";
    }

    // 3. Get anonymous benchmark data
    const industry = currentAnswers.industry;
    const benchmarkData = await getBenchmarkData(industry);

    // 4. Save the new complete assessment
    const newQuestionnaire = new Questionnaire({
      userId,
      answers: currentAnswers, // We now save the industry with the answers
      riskProfile: currentRiskProfile,
    });
    await newQuestionnaire.save();
    console.log(`Node.js: Successfully saved new assessment for user ${userId}.`);

    // 5. Send the complete payload to the frontend
    res.status(201).json({
      current: currentRiskProfile,
      comparison: comparison,
      benchmark: benchmarkData, // Send benchmark data
    });
  })
);

// The route for fetching history remains the same
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const assessments = await Questionnaire.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(assessments);
  })
);

export default router;
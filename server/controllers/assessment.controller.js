import Assessment from '../models/assessment.model.js';
import { predictRisk } from '../services/aiModelService.js';

export const createAssessment = async (req, res) => {
  try {
    const formData = req.body;
    const results = await predictRisk(formData);
    const newAssessmentRecord = new Assessment({
      inputs: formData,
      results: results,
      user: req.user.id,
    });
    await newAssessmentRecord.save();
    res.status(201).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating assessment.', error: error.message });
  }
};

export const getMyAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(assessments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching assessments.', error: error.message });
  }
};
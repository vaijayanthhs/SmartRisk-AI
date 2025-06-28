// client/src/pages/NewAssessmentPage.jsx

import { useState } from 'react';
import api from '../services/api';
import { useToast, Box } from '@chakra-ui/react';
import { RiskForm } from '../components/RiskForm';
import { ResultsDisplay } from '../components/ResultsDisplay';

const NewAssessmentPage = () => {
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setAssessmentResult(null); 
    try {
      // The API endpoint takes the answers object directly
      const res = await api.post('/assessments/predict', { answers: formData });
      setAssessmentResult(res.data);
      toast({
        title: 'Analysis Complete.',
        description: 'Your detailed risk profile is ready.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Analysis Failed.',
        description: error.response?.data?.message || 'An error occurred while contacting the AI service.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAssessmentResult(null);
  };

  return (
    <Box>
      {!assessmentResult ? (
        <RiskForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      ) : (
        <ResultsDisplay data={assessmentResult} onReset={handleReset} />
      )}
    </Box>
  );
};

export default NewAssessmentPage;
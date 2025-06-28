// client/src/components/RiskForm.jsx

import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Heading, Select, VStack, Card, CardBody, CardHeader, Text } from '@chakra-ui/react';
import { questionnaireData } from '../data/questionnaireData.js';

// Function to create the initial state from the questionnaire data
const createInitialState = () => {
  const initialState = {};
  questionnaireData.categories.forEach(category => {
    category.questions.forEach(question => {
      initialState[question.key] = question.options[0].value; // Default to the first option
    });
  });
  return initialState;
};

export const RiskForm = ({ onSubmit, isLoading }) => {
  // State to hold the form data, initialized dynamically
  const [formData, setFormData] = useState(createInitialState());

  // Handler to update state when a form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass the data up to the parent page
  };

  return (
    <Card as="form" onSubmit={handleSubmit} variant="outline" w="100%" maxW="3xl" mx="auto">
      <CardHeader>
        <Heading size="lg" fontWeight="medium" textAlign="center">
          {questionnaireData.title}
        </Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={8}>
          {questionnaireData.categories.map((category) => (
            <Box key={category.key} w="100%">
              <Heading size="md" mb={4} borderBottomWidth="2px" pb={2}>{category.title}</Heading>
              <Text color="gray.600" mb={6}>{category.description}</Text>
              <VStack spacing={6}>
                {category.questions.map((question) => (
                  <FormControl key={question.key} isRequired>
                    <FormLabel>{question.text}</FormLabel>
                    <Select name={question.key} value={formData[question.key]} onChange={handleChange}>
                      {question.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Select>
                  </FormControl>
                ))}
              </VStack>
            </Box>
          ))}
          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            size="lg"
            mt={8}
            isLoading={isLoading}
            loadingText="Analyzing with AI..."
          >
            Assess My Risk
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};
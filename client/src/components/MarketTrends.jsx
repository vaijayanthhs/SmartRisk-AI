// client/src/components/MarketTrends.jsx

import { Box, Heading, Text, VStack, List, ListItem, ListIcon } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

const TrendCard = ({ title, children }) => (
  <Box p={6} borderWidth={1} borderRadius="lg" bg="white">
    <Heading size="md" mb={3}>{title}</Heading>
    <Text color="gray.700">{children}</Text>
  </Box>
);

export const MarketTrends = () => {
  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg" textAlign="center" mt={4}>Promising Startup Fields for 2025</Heading>
      <Text textAlign="center" mb={6}>While any idea can succeed with great execution, these sectors are showing strong tailwinds and investor interest.</Text>
      <List spacing={5}>
        <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <Text as="b" display="inline">AI-Powered Vertical SaaS:</Text>
            Moving beyond generic tools, investors are looking for AI solutions that solve deep, industry-specific problems (e.g., AI for construction logistics, AI for legal document analysis).
        </ListItem>
        <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <Text as="b" display="inline">Personalized & Preventive Healthcare Tech:</Text>
            Using data from wearables and diagnostics to provide proactive health advice and customized treatment plans. This field benefits from an aging population and a greater focus on wellness.
        </ListItem>
        <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <Text as="b" display="inline">Climate Tech & Sustainability:</Text>
            Startups focused on renewable energy, carbon capture, sustainable materials, and circular economy models are attracting significant capital due to regulatory pushes and consumer demand.
        </ListItem>
        <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <Text as="b" display="inline">The Creator Economy 2.0:</Text>
            Tools that help content creators monetize their audience beyond advertising, such as through courses, communities, and direct e-commerce integrations.
        </ListItem>
        <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <Text as="b" display="inline">Cybersecurity for Small Businesses (SMBs):</Text>
            As threats become more sophisticated, there is a growing need for affordable, easy-to-use cybersecurity solutions tailored to small and medium-sized businesses, who are often the most vulnerable.
        </ListItem>
      </List>
    </VStack>
  );
};
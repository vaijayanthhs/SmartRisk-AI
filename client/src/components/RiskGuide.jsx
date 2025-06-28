// client/src/components/RiskGuide.jsx

import { Box, Heading, Text, VStack, SimpleGrid } from '@chakra-ui/react';

const RiskCard = ({ title, children }) => (
  <Box p={6} borderWidth={1} borderRadius="lg" bg="white">
    <Heading size="md" mb={3}>{title}</Heading>
    <Text color="gray.700">{children}</Text>
  </Box>
);

export const RiskGuide = () => {
  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg" textAlign="center" mt={4}>The Four Pillars of Startup Risk</Heading>
      <Text textAlign="center" mb={6}>Successfully navigating the startup journey means proactively managing risk across these four key areas.</Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <RiskCard title="1. Market Risk">
          This is the risk that nobody wants your product. It's the most common reason startups fail. To mitigate it, you must obsess over your customer. Conduct interviews, run surveys, and build an MVP to test your core assumptions before you run out of money. Don't build what you think they want; build what they prove they need.
        </RiskCard>
        <RiskCard title="2. Financial Risk">
          This covers everything from running out of cash (runway) to having a flawed business model. Mitigation involves detailed financial planning, raising sufficient capital, controlling your burn rate, and quickly finding a scalable, profitable way to charge for your product. Every founder must understand their numbers.
        </RiskCard>
        <RiskCard title="3. Product & Tech Risk">
          This is the risk that you can't build what you envision, or that it will be too slow, too buggy, or built on technology that becomes obsolete. You mitigate this with a strong technical co-founder, a realistic product roadmap, and an agile development process that prioritizes shipping a stable, core product quickly.
        </RiskCard>
        <RiskCard title="4. Team & Execution Risk">
          The best idea will fail with the wrong team. This risk includes founder disputes, skill gaps, and an inability to hire A-players. Mitigation requires clear founder agreements, a culture of open communication, and a strategic approach to hiring for your weaknesses.
        </RiskCard>
      </SimpleGrid>
    </VStack>
  );
};
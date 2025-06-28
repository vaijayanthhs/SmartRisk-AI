// client/src/pages/InsightsPage.jsx

import { VStack, Heading, Text, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { RiskGuide } from '../components/RiskGuide';
import { MarketTrends } from '../components/MarketTrends';
import { FounderAgreementGuide } from '../components/guides/FounderAgreementGuide'; // New import

export const InsightsPage = () => {
  return (
    <VStack spacing={8} align="stretch">
      <VStack>
        <Heading as="h1" size="2xl">Founder's Knowledge Base</Heading>
        <Text fontSize="lg" color="gray.600">Actionable advice and insights to help you de-risk your venture.</Text>
      </VStack>
      <Tabs isFitted variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>Understanding Startup Risk</Tab>
          <Tab>Key Market Trends</Tab>
          <Tab>Founder Agreements</Tab>
        </TabList>
        <TabPanels>
          <TabPanel><RiskGuide /></TabPanel>
          <TabPanel><MarketTrends /></TabPanel>
          <TabPanel><FounderAgreementGuide /></TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};
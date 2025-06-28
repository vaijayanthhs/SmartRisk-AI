// client/src/components/guides/FounderAgreementGuide.jsx

import { Box, Heading, Text, VStack, List, ListItem, ListIcon, Divider } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

export const FounderAgreementGuide = () => {
  return (
    <VStack spacing={6} align="stretch" p={{base: 2, md: 6}} bg="white" borderRadius="lg" borderWidth={1}>
      <Heading size="lg" textAlign="center">The Essential Founder's Agreement</Heading>
      <Text textAlign="center" color="gray.600">
        This is arguably the most important document you will create in the early days of your startup. 
        It's a prenuptial agreement for your business that aligns expectations and prevents future conflict.
      </Text>
      <Divider />
      <Box>
        <Heading size="md" mb={3}>Why is it Non-Negotiable?</Heading>
        <Text>
          Startups are high-stress environments. When pressure mounts over money, product, or strategy, 
          unspoken assumptions about roles and ownership can quickly turn into company-killing disputes. A founder's
          agreement forces you to have these difficult conversations *before* they become problems.
        </Text>
      </Box>
      <Box>
        <Heading size="md" mb={4}>Key Clauses to Include</Heading>
        <List spacing={4}>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <Text as="b" display="inline">Roles & Responsibilities:</Text> Who is the CEO, CTO, etc.? Who has the final say on product decisions? Financial decisions? Be explicit.
          </ListItem>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <Text as="b" display="inline">Equity Ownership:</Text> How is the ownership split? Is it 50/50? 60/40? Don't default to an equal split without discussion. Consider initial contributions and ongoing roles.
          </ListItem>
           <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <Text as="b" display="inline">Vesting Schedule:</Text> This is critical. Equity should be earned over time (a typical schedule is 4 years with a 1-year cliff). This protects the company if a founder leaves early.
          </ListItem>
           <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <Text as="b" display="inline">Intellectual Property (IP) Assignment:</Text> The agreement must state that any IP created by the founders related to the business is owned by the company, not the individual.
          </ListItem>
           <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <Text as="b" display="inline">Departure & Buyout Clauses:</Text> What happens if a founder wants to leave, or is fired? How is their vested equity handled? Is there a buyout mechanism?
          </ListItem>
        </List>
      </Box>
      <Box p={4} bg="red.50" borderRadius="md">
        <Heading size="sm" color="red.700" display="flex" alignItems="center">
            <WarningIcon mr={2} /> A Word of Warning
        </Heading>
        <Text color="red.800" mt={2}>
            Do not just download a template from the internet and sign it. While templates are a great starting point,
            it is highly recommended to have a lawyer review the final document to ensure it is legally sound and
            tailored to your specific situation and jurisdiction.
        </Text>
      </Box>
    </VStack>
  );
};
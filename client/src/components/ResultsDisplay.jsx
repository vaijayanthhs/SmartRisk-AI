// client/src/components/ResultsDisplay.jsx

import { Link as RouterLink } from 'react-router-dom';
// THE FIX IS ON THE LINE BELOW: I have added 'Flex' to the import list.
import { Box, Heading, Text, VStack, Button, Card, CardBody, CardHeader, List, ListItem, ListIcon, Alert, AlertIcon, AlertTitle, AlertDescription, Center, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Link, Divider, Tag, Flex } from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BenchmarkStat = ({ name, userScore, benchmarkScore }) => {
    const diff = userScore - benchmarkScore;
    const diffType = diff > 0.01 ? 'increase' : 'decrease';
    
    return (
        <Stat>
            <StatLabel>{name}</StatLabel>
            <StatNumber>{(userScore * 100).toFixed(0)}%</StatNumber>
            <StatHelpText>
                <StatArrow type={diffType} />
                {(Math.abs(diff) * 100).toFixed(0)}% vs. benchmark of {(benchmarkScore * 100).toFixed(0)}%
            </StatHelpText>
        </Stat>
    );
};


export const ResultsDisplay = ({ data, onReset }) => {
    const { current, comparison, benchmark } = data;
    const { riskLevel, overallScore, riskBreakdown, suggestions } = current;

    const chartData = {
        labels: ['Market', 'Financial', 'Product', 'Team'],
        datasets: [{
            label: 'Your Risk (%)',
            data: Object.values(riskBreakdown).map(v => v * 100),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        },
        // Add benchmark data if it exists
        ...(benchmark ? [{
            label: `Benchmark Avg. (${benchmark._id})`,
            data: [
                benchmark.avgMarket * 100,
                benchmark.avgFinancial * 100,
                benchmark.avgProduct * 100,
                benchmark.avgTeam * 100
            ],
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        }] : [])],
    };

    const chartOptions = {
        indexAxis: 'y',
        scales: { x: { beginAtZero: true, max: 100, title: { display: true, text: 'Risk Score (%)' } } },
        responsive: true,
        plugins: { legend: { display: true } },
    };

    const getRiskStatus = (level) => {
        if (level === 'High') return 'error';
        if (level === 'Medium') return 'warning';
        return 'success';
    };

    // Mapping of resource keys to frontend routes
    const resourceRoutes = {
      'founder-agreement': '/insights/founder-agreement',
      // Add other keys here as you create more resource pages
    };

    return (
        <VStack spacing={8} align="stretch" w="100%" maxW="4xl" mx="auto">
            <Alert
              status={getRiskStatus(riskLevel)} variant="subtle"
              flexDirection="column" alignItems="center" justifyContent="center"
              textAlign="center" height="200px" borderRadius="lg"
            >
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="4xl">{riskLevel} Risk</AlertTitle>
                <AlertDescription maxWidth="sm" fontSize="6xl" fontWeight="bold">
                    {(overallScore * 100).toFixed(0)}%
                </AlertDescription>
            </Alert>
            
            {comparison?.message && (
                <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <AlertTitle>Progress Update:</AlertTitle>
                    <AlertDescription>{comparison.message}</AlertDescription>
                </Alert>
            )}

            {/* --- NEW BENCHMARK SECTION --- */}
            {benchmark && benchmark.count > 2 && (
              <Card variant="outline">
                <CardHeader>
                    <Flex align="center">
                        <Heading size="md">Anonymous Benchmarking</Heading>
                        <Tag ml={4} colorScheme="teal">Compared against {benchmark.count} other '{benchmark._id}' startups</Tag>
                    </Flex>
                </CardHeader>
                <CardBody>
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                        <BenchmarkStat name="Market Risk" userScore={riskBreakdown.marketRisk} benchmarkScore={benchmark.avgMarket} />
                        <BenchmarkStat name="Financial Risk" userScore={riskBreakdown.financialRisk} benchmarkScore={benchmark.avgFinancial} />
                        <BenchmarkStat name="Product Risk" userScore={riskBreakdown.productRisk} benchmarkScore={benchmark.avgProduct} />
                        <BenchmarkStat name="Team Risk" userScore={riskBreakdown.teamRisk} benchmarkScore={benchmark.avgTeam} />
                    </SimpleGrid>
                </CardBody>
              </Card>
            )}

            <Card variant="outline">
                <CardHeader><Heading size="md">Actionable Suggestions</Heading></CardHeader>
                <CardBody>
                    <List spacing={4}>
                        {suggestions.map((suggestion, index) => (
                            <ListItem key={index} display="flex" alignItems="start">
                                <ListIcon as={WarningTwoIcon} color="orange.400" mt={1} />
                                <Box>
                                    {suggestion.text}
                                    {suggestion.resourceKey && resourceRoutes[suggestion.resourceKey] && (
                                        <Link as={RouterLink} to={resourceRoutes[suggestion.resourceKey]} color="blue.500" fontWeight="bold" ml={2}>
                                            Learn more »
                                        </Link>
                                    )}
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </CardBody>
            </Card>

            <Card variant="outline">
                <CardHeader><Heading size="md">Risk Factor Breakdown</Heading></CardHeader>
                <CardBody>
                    <Bar data={chartData} options={chartOptions} />
                </CardBody>
            </Card>

            <Center>
                <Button onClick={onReset} colorScheme="blue" size="lg" variant="outline">
                    Assess Another Venture
                </Button>
            </Center>
        </VStack>
    );
};
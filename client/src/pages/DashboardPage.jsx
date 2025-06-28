// client/src/pages/DashboardPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Box, Button, Heading, VStack, Text, Spinner, Card, CardBody, CardHeader, SimpleGrid, Tag, Flex, Spacer, Center } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components for a line chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await api.get('/assessments');
        // Reverse the array to have dates in chronological order for the chart
        const sortedAssessments = res.data.slice().reverse();
        setAssessments(res.data); // Keep original order for display cards

        if (sortedAssessments.length > 1) {
          const labels = sortedAssessments.map(a => new Date(a.createdAt).toLocaleDateString());
          const overallScores = sortedAssessments.map(a => a.riskProfile.overallScore * 100);
          
          setChartData({
            labels,
            datasets: [
              {
                label: 'Overall Risk Score (%)',
                data: overallScores,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                tension: 0.1,
              },
            ],
          });
        }

      } catch (error) {
        console.error("Failed to fetch assessments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  const getRiskColor = (level) => {
      if (level === 'High') return 'red';
      if (level === 'Medium') return 'orange';
      if (level === 'Low') return 'green';
      return 'gray'; 
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Your Risk Score Over Time' },
    },
    scales: { y: { beginAtZero: true, max: 100 } },
  };

  return (
    <VStack spacing={8} align="stretch">
      <Flex direction={{ base: 'column', md: 'row' }} align="center" gap={4}>
        <Box textAlign={{ base: 'center', md: 'left' }}>
          <Heading>Welcome, {user?.name || 'Founder'}!</Heading>
          <Text mt={2} fontSize="xl" color="gray.600">
            Ready to assess a new venture or review your progress?
          </Text>
        </Box>
        <Spacer />
        <Button colorScheme="blue" size="lg" onClick={() => navigate('/assess/new')}>
          Start New Assessment
        </Button>
      </Flex>
      
      {/* Historical Progress Chart */}
      {chartData && (
        <Card variant="outline">
          <CardBody>
            <Line options={chartOptions} data={chartData} />
          </CardBody>
        </Card>
      )}

      <Box>
        <Heading size="lg" mb={4}>Assessment History</Heading>
        {isLoading ? (
          <Center><Spinner /></Center>
        ) : assessments.length === 0 ? (
          <Text>You have no saved assessments yet. Start your first one now!</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {assessments.map((item) => (
              <Card key={item._id} variant="outline">
                <CardHeader>
                  <Heading size="md">Assessed on {new Date(item.createdAt).toLocaleDateString()}</Heading>
                </CardHeader>
                <CardBody>
                  <Text>
                    Overall Risk:{' '}
                    <Tag size="lg" colorScheme={getRiskColor(item.riskProfile?.riskLevel)}>
                      {item.riskProfile?.riskLevel || 'Pending'}
                    </Tag>
                  </Text>
                  <Text mt={2}>
                    Score:{' '}
                    <strong>
                      {item.riskProfile?.overallScore ? `${(item.riskProfile.overallScore * 100).toFixed(0)}%` : 'N/A'}
                    </strong>
                  </Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </VStack>
  );
};

export default DashboardPage;
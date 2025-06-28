// client/src/components/Layout.jsx

import { Box, Container, Flex, Heading, Button, Spacer } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Layout = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box bg="gray.50" minH="100vh">
      {/* Navigation Bar */}
      <Box bg="white" boxShadow="sm">
        <Container maxW="container.xl" py={3}>
          <Flex align="center">
            <Heading
              size="md"
              color="blue.600"
              cursor="pointer"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
            >
              SmartRisk AI
            </Heading>
            <Spacer />
            {isAuthenticated && (
              <Button colorScheme="blue" variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Flex>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxW="container.xl" pt={10} pb={20}>
        <main>{children}</main>
      </Container>
    </Box>
  );
};
// client/src/pages/LoginPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Box, Button, FormControl, FormLabel, Input, Heading, VStack, useToast, Text, Link, Spinner, Center } from '@chakra-ui/react';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth(); // Destructure both isAuthenticated and isLoading
  const navigate = useNavigate();
  const toast = useToast();

  // --- PRIMARY FIX ---
  // This useEffect hook will reliably trigger the navigation AFTER the
  // isAuthenticated state has been updated and the component has re-rendered.
  useEffect(() => {
    // We only want to navigate if the auth state is confirmed (not loading)
    // and the user is authenticated.
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/login', formData);

      // Explicitly check for the required data before calling login
      if (res.data && res.data.user && res.data.token) {
        login(res.data.user, res.data.token);
        // The useEffect will handle the navigation from here.
      } else {
        // This handles cases where the API returns a 200 OK but with unexpected data.
        throw new Error("Login response was invalid.");
      }

    } catch (error) {
      toast({
        title: 'Login failed.',
        description: error.response?.data?.message || 'Invalid credentials or server error.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsSubmitting(false); // Make sure to re-enable the form on error
    }
  };
  
  // --- ROBUSTNESS FIX ---
  // While the context is checking the token, show a full-page spinner.
  // This also prevents a logged-in user from briefly seeing the login form.
  if (isLoading) {
    return (
        <Center h="100vh">
            <Spinner size="xl" />
        </Center>
    );
  }

  return (
    <Box maxW="md" mx="auto" mt={10}>
      <VStack as="form" onSubmit={handleSubmit} spacing={6} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
        <Heading>Log In</Heading>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" value={formData.email} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" value={formData.password} onChange={handleChange} />
        </FormControl>
        <Button type="submit" colorScheme="blue" width="full" isLoading={isSubmitting}>
          Log In
        </Button>
        <Text>
          Don't have an account?{' '}
          <Link as={RouterLink} to="/register" color="blue.500">
            Sign up
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default LoginPage;
// client/src/pages/RegisterPage.jsx

import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Box, Button, FormControl, FormLabel, Input, Heading, VStack, useToast, Text, Link } from '@chakra-ui/react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Call the registration endpoint
      const res = await api.post('/auth/register', formData);
      
      // On success, use the login function from AuthContext
      login(res.data.user, res.data.token);

      toast({
        title: 'Account created.',
        description: "You've been successfully registered and logged in.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/dashboard'); // Redirect to the dashboard
    } catch (error) {
      toast({
        title: 'Registration failed.',
        description: error.response?.data?.message || 'An error occurred.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10}>
      <VStack as="form" onSubmit={handleSubmit} spacing={6} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
        <Heading>Create Your Account</Heading>
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input type="text" name="name" onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" onChange={handleChange} />
        </FormControl>
        <Button type="submit" colorScheme="blue" width="full" isLoading={isLoading}>
          Register
        </Button>
        <Text>
          Already have an account?{' '}
          <Link as={RouterLink} to="/login" color="blue.500">
            Log in
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default RegisterPage;
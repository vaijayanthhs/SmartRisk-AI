// client/src/App.jsx

import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { InsightsPage } from './pages/InsightsPage';

// Import all our page components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NewAssessmentPage from './pages/NewAssessmentPage';

function App() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Default route redirects to login */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/insights" 
          element={
          <ProtectedRoute>
            <InsightsPage />
            </ProtectedRoute>
          } 
          />
        <Route
          path="/assess/new"
          element={
            <ProtectedRoute>
              <NewAssessmentPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
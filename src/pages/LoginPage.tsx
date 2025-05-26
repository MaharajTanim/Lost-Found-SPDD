import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/Auth/LoginForm';
import Card, { CardContent } from '../components/UI/Card';

const LoginPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  // Redirect if already logged in
  if (!isLoading && user) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardContent className="p-8">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
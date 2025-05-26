import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RegisterForm from '../components/Auth/RegisterForm';
import Card, { CardContent } from '../components/UI/Card';

const RegisterPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  // Redirect if already logged in
  if (!isLoading && user) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardContent className="p-8">
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
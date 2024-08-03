import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FormProduct from '../components/formProduct/FormProduct';
import LoginForm from '../components/loginForm/LoginForm';
import { useAuthStore } from '../store/useAuthStore';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route
        path="/products"
        element={isAuthenticated ? <FormProduct /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

export default AppRoutes;
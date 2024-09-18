import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem('access_token');
  
  // If the token is not present, redirect to the login page
  return token ? Component : <Navigate to="/login" />;
};

export default ProtectedRoute;
// components/ProtectedRoute.jsx (Conceptual)
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Assuming your user state is managed in Redux
  const { user } = useSelector((store) => store.auth); 

  // If the user object exists, allow access to the child route (Outlet)
  // Otherwise, redirect them to the login page
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
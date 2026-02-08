import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import DashboardLoader from "./Loaders/DashboardLoader";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <DashboardLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/Auth" replace />;
  }

  if (requiredRole && (!user || user.role !== requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

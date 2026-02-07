import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import DashboardLoader from "./Loaders/DashboardLoader";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <DashboardLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/Auth" replace />;
  }

  return children;
};

export default ProtectedRoute;

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles?.length) {
    const userRole = user?.role;
    if (!userRole || !roles.includes(userRole)) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  return <Outlet />;
}

import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, roleRequired, children }) => {
  if (!user) return <Navigate to="/login/user" />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";

export default function ProtectedRouter() {
  const Auth = useAuth();

  return Auth.isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

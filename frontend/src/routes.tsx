import { createBrowserRouter, Navigate } from "react-router-dom";
import React from "react";
import { useAuthStore } from "@/store/auth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Simplified routing layout stubs
export const router = createBrowserRouter([
  {
    path: "/login",
    element: <div className="p-8">Login Page (Foundation Ready)</div>,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <div className="p-8">Dashboard Layout & Content (Foundation Ready)</div>
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <div className="p-8">404 - Not Found</div>,
  },
]);

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes";
import "./index.css";

import { useEffect } from "react";
import { useAuthStore } from "./store/auth";
import { useThemeStore } from "./store/theme";

const queryClient = new QueryClient();

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const fetchProfile = useAuthStore(state => state.fetchProfile);
  const isLoading = useAuthStore(state => state.isLoading);
  const theme = useThemeStore(state => state.theme);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  if (isLoading) {
    return <div className="flex h-screen w-screen items-center justify-center bg-gray-950 text-white">Loading Mechamind OS...</div>;
  }

  return <>{children}</>;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
    </QueryClientProvider>
  </React.StrictMode>
);

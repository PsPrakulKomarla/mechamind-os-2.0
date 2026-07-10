import React from "react";
import { useNavigate } from "react-router-dom";

export const SessionExpiredPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-bg px-4">
      <div className="w-full max-w-md bg-secondary-bg border border-gray-800 rounded-lg p-8 text-center shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">Session Expired</h2>
        <p className="text-gray-400 mb-6">For security reasons, your active session has expired due to inactivity or token lifetime policies.</p>
        <button onClick={() => navigate("/login")} className="w-full bg-accent hover:bg-blue-600 text-white font-medium py-2 rounded">
          Log In Again
        </button>
      </div>
    </div>
  );
};

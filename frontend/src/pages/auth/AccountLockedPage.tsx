import React from "react";
import { useNavigate } from "react-router-dom";

export const AccountLockedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-bg px-4">
      <div className="w-full max-w-md bg-secondary-bg border border-gray-800 rounded-lg p-8 text-center shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">Account Locked</h2>
        <p className="text-gray-400 mb-6">Your account has been temporarily locked due to too many failed login attempts. Please contact your administrator or verify your identity via recovery OTP.</p>
        <div className="flex gap-4">
          <button onClick={() => navigate("/forgot-password")} className="w-1/2 bg-accent hover:bg-blue-600 text-white font-medium py-2 rounded">
            Recovery Link
          </button>
          <button onClick={() => navigate("/login")} className="w-1/2 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 rounded">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

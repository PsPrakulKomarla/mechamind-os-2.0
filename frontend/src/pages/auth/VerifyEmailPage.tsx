import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = React.useState<"loading" | "success" | "error">("loading");

  React.useEffect(() => {
    if (token) {
      api.post("/auth/verify-email", { token })
        .then(() => setStatus("success"))
        .catch(() => setStatus("error"));
    } else {
      setStatus("error");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-bg px-4">
      <div className="w-full max-w-md bg-secondary-bg border border-gray-800 rounded-lg p-8 text-center shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Email Verification</h2>
        {status === "loading" && <p className="text-gray-400">Verifying your email address...</p>}
        {status === "success" && (
          <div>
            <p className="text-success mb-6">Your email has been successfully verified!</p>
            <button onClick={() => navigate("/login")} className="w-full bg-accent hover:bg-blue-600 text-white font-medium py-2 rounded">
              Proceed to Login
            </button>
          </div>
        )}
        {status === "error" && (
          <div>
            <p className="text-danger mb-6">Invalid or expired verification token.</p>
            <button onClick={() => navigate("/login")} className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 rounded">
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

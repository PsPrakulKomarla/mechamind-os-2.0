import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Cpu, Loader2, CheckCircle, XCircle } from "lucide-react";
import { authService } from "@/services/authService";

type VerifyStatus = "loading" | "success" | "error";

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<VerifyStatus>("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    authService
      .verifyEmail(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1220] px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 mb-4">
            <Cpu size={28} className="text-[#3B82F6]" />
          </div>
          <h1 className="text-2xl font-bold text-white">MechaMind OS 2.0</h1>
        </div>

        {/* Card */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-8 shadow-2xl shadow-black/40 text-center">
          {status === "loading" && (
            <div className="py-4">
              <Loader2
                size={36}
                className="text-[#3B82F6] animate-spin mx-auto mb-4"
              />
              <h2 className="text-xl font-bold text-white mb-2">
                Verifying your email
              </h2>
              <p className="text-sm text-gray-400">
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#10B981]/10 mb-4">
                <CheckCircle size={28} className="text-[#10B981]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Email Verified
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                Your email address has been successfully verified. You can now
                sign in to your account.
              </p>
              <Link
                to="/login"
                className="block w-full text-center bg-[#3B82F6] hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                Sign in
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#EF4444]/10 mb-4">
                <XCircle size={28} className="text-[#EF4444]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Verification Failed
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                {token
                  ? "The verification link is invalid or has expired. Please request a new one."
                  : "No verification token was provided. Please check your email for the correct link."}
              </p>
              <Link
                to="/login"
                className="block w-full text-center bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 rounded-lg border border-gray-700 transition-colors"
              >
                Back to sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cpu, Loader2, ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";


export const MfaPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mfaMutation = useMutation({
    mutationFn: async (mfaCode: string) => {
      const res = await api.post("/auth/mfa/verify", { code: mfaCode });
      return res.data;
    },
    onSuccess: () => {
      navigate("/", { replace: true });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      setError(
        err.response?.data?.message ||
          "Invalid verification code. Please try again."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (code.length === 6) {
      mfaMutation.mutate(code);
    }
  };

  const handleCodeChange = (value: string) => {
    const filtered = value.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(filtered);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1220] px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 mb-4">
            <Cpu size={28} className="text-[#3B82F6]" />
          </div>
          <h1 className="text-2xl font-bold text-white">MechaMind OS 2.0</h1>
          <p className="text-sm text-gray-400 mt-1">
            Two-factor authentication
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-8 shadow-2xl shadow-black/40">
          <p className="text-sm text-gray-400 text-center mb-6">
            Enter the 6-digit verification code from your authenticator app to
            continue.
          </p>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-sm text-[#EF4444] text-center animate-in fade-in duration-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Code Input */}
            <div>
              <label
                htmlFor="mfa-code"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Verification code
              </label>
              <input
                id="mfa-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-full bg-[#0B1220] border border-gray-800 text-white rounded-lg px-3.5 py-3 text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all placeholder:text-gray-600"
                maxLength={6}
              />
              <p className="text-xs text-gray-500 text-center mt-2">
                {code.length}/6 digits entered
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={mfaMutation.isPending || code.length !== 6}
              className="w-full flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mfaMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify code"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

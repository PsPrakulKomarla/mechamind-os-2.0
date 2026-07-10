import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

export const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<{ otp: string }>();
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (data: { otp: string }) => {
    try {
      await api.post("/auth/verify-otp", data);
      navigate("/");
    } catch (err) {
      setError("Invalid OTP code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-bg px-4">
      <div className="w-full max-w-md bg-secondary-bg border border-gray-800 rounded-lg p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Enter OTP</h2>
        {error && <div className="mb-4 text-xs text-danger text-center">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("otp")}
            placeholder="XXXXXX"
            className="w-full bg-primary-bg border border-gray-700 rounded px-3 py-2 text-white text-center text-lg tracking-widest focus:outline-none focus:border-accent"
          />
          <button type="submit" className="w-full bg-accent hover:bg-blue-600 text-white font-medium py-2 rounded">
            Verify Code
          </button>
        </form>
      </div>
    </div>
  );
};

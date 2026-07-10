import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { authService } from "@/services/authService";

const forgotPasswordSchema = zod.object({
  email: zod.string().email("Please enter a valid email address")
});

type ForgotPasswordFields = zod.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFields>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordFields) => {
    try {
      await authService.forgotPassword(data);
      alert("Password reset OTP has been sent if the email exists.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-bg px-4">
      <div className="w-full max-w-md bg-secondary-bg border border-gray-800 rounded-lg p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
            <input
              {...register("email")}
              type="email"
              className="w-full bg-primary-bg border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent"
              placeholder="operator@mechamind.local"
            />
            {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-accent hover:bg-blue-600 text-white font-medium py-2 rounded transition-colors"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

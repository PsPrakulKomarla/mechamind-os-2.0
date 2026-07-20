import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";

const resetPasswordSchema = zod.object({
  email: zod.string().email(),
  otp: zod.string().min(4, "OTP must be at least 4 digits"),
  new_password: zod.string().min(6, "Password must be at least 6 characters")
});

type ResetFields = zod.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<ResetFields>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const onSubmit = async (data: ResetFields) => {
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      await authService.resetPassword(data);
      navigate("/login");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-bg to-secondary-bg px-4">
      <div className="w-full max-w-md bg-primary-bg/80 backdrop-blur-sm border border-gray-800 rounded-xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Reset Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-danger/20 border border-danger text-danger text-sm rounded">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full bg-primary-bg/60 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent"
            />
            {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">OTP</label>
            <input
              {...register("otp")}
              className="w-full bg-primary-bg/60 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent"
              placeholder="e.g. 123456"
            />
            {errors.otp && <p className="text-xs text-danger mt-1">{errors.otp.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">New Password</label>
            <input
              {...register("new_password")}
              type="password"
              className="w-full bg-primary-bg/60 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent"
            />
            {errors.new_password && <p className="text-xs text-danger mt-1">{errors.new_password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent hover:bg-blue-600 text-white font-medium py-2 rounded transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

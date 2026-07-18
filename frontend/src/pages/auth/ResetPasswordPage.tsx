import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Cpu, Loader2, ArrowLeft } from "lucide-react";
import { useResetPasswordMutation } from "@/hooks/useAuthQueries";

const resetPasswordSchema = zod
  .object({
    new_password: zod
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: zod.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFields = zod.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const resetPasswordMutation = useResetPasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFields>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFields) => {
    if (!token) return;
    resetPasswordMutation.mutate(
      { token, new_password: data.new_password },
      {
        onSuccess: () =>
          navigate("/login", {
            state: {
              message:
                "Password reset successful. Please sign in with your new password.",
            },
          }),
      }
    );
  };

  const axiosError = resetPasswordMutation.error as
    | { response?: { data?: { message?: string } } }
    | undefined;
  const errorMessage =
    axiosError?.response?.data?.message ||
    "Failed to reset password. The link may have expired.";

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1220] px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 mb-4">
              <Cpu size={28} className="text-[#3B82F6]" />
            </div>
            <h1 className="text-2xl font-bold text-white">MechaMind OS 2.0</h1>
          </div>
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-8 shadow-2xl shadow-black/40 text-center">
            <h2 className="text-xl font-bold text-white mb-2">
              Invalid Reset Link
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              This password reset link is invalid or missing a token. Please
              request a new one.
            </p>
            <Link
              to="/forgot-password"
              className="block w-full text-center bg-[#3B82F6] hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Request new link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1220] px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 mb-4">
            <Cpu size={28} className="text-[#3B82F6]" />
          </div>
          <h1 className="text-2xl font-bold text-white">MechaMind OS 2.0</h1>
          <p className="text-sm text-gray-400 mt-1">Set a new password</p>
        </div>

        {/* Card */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-8 shadow-2xl shadow-black/40">
          <p className="text-sm text-gray-400 mb-6">
            Enter your new password below. Make sure it&apos;s strong and
            something you&apos;ll remember.
          </p>

          {/* Error Alert */}
          {resetPasswordMutation.isError && (
            <div className="mb-6 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-sm text-[#EF4444] text-center animate-in fade-in duration-200">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* New Password */}
            <div>
              <label
                htmlFor="new_password"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                New password
              </label>
              <div className="relative">
                <input
                  id="new_password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  className="w-full bg-[#0B1220] border border-gray-800 text-white rounded-lg px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all placeholder:text-gray-600"
                  {...register("new_password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.new_password && (
                <p className="text-xs text-[#EF4444] mt-1.5">
                  {errors.new_password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  className="w-full bg-[#0B1220] border border-gray-800 text-white rounded-lg px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all placeholder:text-gray-600"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-[#EF4444] mt-1.5">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Resetting password...
                </>
              ) : (
                "Reset password"
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

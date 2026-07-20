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

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const onSubmit = async (data: ForgotPasswordFields) => {
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      await authService.forgotPassword(data);
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to process request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-bg to-secondary-bg px-4">
      <div className="w-full max-w-md bg-primary-bg/80 backdrop-blur-sm border border-gray-800 rounded-xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Forgot Password</h2>
        
        {success ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-success/20 border border-success text-success rounded-md text-sm">
              If an account exists, a password reset link or OTP has been sent.
            </div>
            <a href="/login" className="text-accent text-sm hover:underline block">Return to Login</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-danger/20 border border-danger text-danger text-sm rounded">
                {errorMsg}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
              <input
                {...register("email")}
                type="email"
                className="w-full bg-primary-bg/60 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent"
                placeholder="operator@mechamind.local"
              />
              {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent hover:bg-blue-600 text-white font-medium py-2 rounded transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Reset Instructions"}
            </button>
            <div className="text-center mt-4">
              <a href="/login" className="text-gray-400 text-sm hover:text-white transition-colors">Back to Login</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link } from "react-router-dom";
import { Cpu, Loader2, Mail, ArrowLeft } from "lucide-react";
import { useForgotPasswordMutation } from "@/hooks/useAuthQueries";

const forgotPasswordSchema = zod.object({
  email: zod.string().email("Please enter a valid email address"),
});

type ForgotPasswordFields = zod.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage = () => {
  const forgotPasswordMutation = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFields>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFields) => {
    forgotPasswordMutation.mutate(data);
  };

  const axiosError = forgotPasswordMutation.error as
    | { response?: { data?: { message?: string } } }
    | undefined;
  const errorMessage =
    axiosError?.response?.data?.message ||
    "Failed to send reset link. Please try again.";

  if (forgotPasswordMutation.isSuccess) {
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
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#3B82F6]/10 mb-4">
              <Mail size={28} className="text-[#3B82F6]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
            <p className="text-sm text-gray-400 mb-6">
              We&apos;ve sent a password reset link to your email address. Please
              check your inbox and follow the instructions.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 text-sm text-[#3B82F6] hover:text-blue-400 font-medium transition-colors"
            >
              <ArrowLeft size={14} />
              Back to sign in
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
          <p className="text-sm text-gray-400 mt-1">Reset your password</p>
        </div>

        {/* Card */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-8 shadow-2xl shadow-black/40">
          <p className="text-sm text-gray-400 mb-6">
            Enter the email address associated with your account and we&apos;ll
            send you a link to reset your password.
          </p>

          {/* Error Alert */}
          {forgotPasswordMutation.isError && (
            <div className="mb-6 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-sm text-[#EF4444] text-center animate-in fade-in duration-200">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="operator@mechamind.local"
                className="w-full bg-[#0B1220] border border-gray-800 text-white rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all placeholder:text-gray-600"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-[#EF4444] mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {forgotPasswordMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending link...
                </>
              ) : (
                "Send reset link"
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

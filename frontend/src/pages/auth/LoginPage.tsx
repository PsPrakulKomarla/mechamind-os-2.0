import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Cpu, Loader2 } from "lucide-react";
import { useLoginMutation } from "@/hooks/useAuthQueries";


const loginSchema = zod.object({
  email: zod.string().email("Please enter a valid email address"),
  password: zod.string().min(1, "Password is required"),
});

type LoginFields = zod.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as { from?: string })?.from || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
  });



  const onSubmit = (data: LoginFields) => {
    loginMutation.mutate(data, {
      onSuccess: () => navigate(from, { replace: true }),
    });
  };

  const axiosError = loginMutation.error as
    | { response?: { data?: { message?: string } } }
    | undefined;
  const errorMessage =
    axiosError?.response?.data?.message ||
    "Invalid email or password. Please try again.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1220] px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 mb-4">
            <Cpu size={28} className="text-[#3B82F6]" />
          </div>
          <h1 className="text-2xl font-bold text-white">MechaMind OS 2.0</h1>
          <p className="text-sm text-gray-400 mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-8 shadow-2xl shadow-black/40">
          {/* Error Alert */}
          {loginMutation.isError && (
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
                Email
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

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full bg-[#0B1220] border border-gray-800 text-white rounded-lg px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all placeholder:text-gray-600"
                  {...register("password")}
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
              {errors.password && (
                <p className="text-xs text-[#EF4444] mt-1.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-[#3B82F6] hover:text-blue-400 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
               type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-[#3B82F6] hover:text-blue-400 font-medium transition-colors"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

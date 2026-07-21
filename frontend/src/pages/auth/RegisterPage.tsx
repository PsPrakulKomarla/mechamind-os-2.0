import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Cpu, Loader2, CheckCircle } from "lucide-react";
import { useRegisterMutation } from "@/hooks/useAuthQueries";

const registerSchema = zod
  .object({
    first_name: zod.string().min(1, "First name is required"),
    last_name: zod.string().min(1, "Last name is required"),
    email: zod.string().email("Please enter a valid email address"),
    password: zod
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: zod.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFields = zod.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFields) => {
    registerMutation.mutate(
      {
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
      },
      {
        onSuccess: () => setSuccess(true),
      }
    );
  };

  const axiosError = registerMutation.error as
    | { response?: { data?: { message?: string } } }
    | undefined;
  const errorMessage =
    axiosError?.response?.data?.message ||
    "Registration failed. Please try again.";

  if (success) {
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
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#10B981]/10 mb-4">
              <CheckCircle size={28} className="text-[#10B981]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Account Created
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Your account has been created successfully. Please sign in to
              continue.
            </p>
            <Link
              to="/login"
              className="block w-full text-center bg-[#3B82F6] hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Sign in
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
          <Link to="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 mb-4 hover:bg-[#3B82F6]/20 transition-colors">
            <Cpu size={28} className="text-[#3B82F6]" />
          </Link>
          <h1 className="text-2xl font-bold text-white">MechaMind OS 2.0</h1>
          <p className="text-sm text-gray-400 mt-1">
            Create your account to get started
          </p>
          <Link to="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors mt-2 inline-block">
            &larr; Back to home
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-8 shadow-2xl shadow-black/40">
          {/* Error Alert */}
          {registerMutation.isError && (
            <div className="mb-6 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-sm text-[#EF4444] text-center animate-in fade-in duration-200">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  First name
                </label>
                <input
                  id="first_name"
                  type="text"
                  autoComplete="given-name"
                  placeholder="John"
                  className="w-full bg-[#0B1220] border border-gray-800 text-white rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all placeholder:text-gray-600"
                  {...register("first_name")}
                />
                {errors.first_name && (
                  <p className="text-xs text-[#EF4444] mt-1.5">
                    {errors.first_name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Last name
                </label>
                <input
                  id="last_name"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Doe"
                  className="w-full bg-[#0B1220] border border-gray-800 text-white rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all placeholder:text-gray-600"
                  {...register("last_name")}
                />
                {errors.last_name && (
                  <p className="text-xs text-[#EF4444] mt-1.5">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

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
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              disabled={registerMutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#3B82F6] hover:text-blue-400 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

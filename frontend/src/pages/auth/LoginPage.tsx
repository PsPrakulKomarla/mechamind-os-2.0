import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Cpu, Loader2 } from "lucide-react";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/auth";

const loginSchema = zod.object({
  email: zod.string().email("Please enter a valid email address"),
  password: zod.string().min(1, "Password is required"),
});

type LoginFields = zod.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const setAuth = useAuthStore((state) => state.setAuth);

  const from = (location.state as { from?: string })?.from || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFields) => {
    try {
      setErrorMsg("");
      const response = await authService.login(data);
      // Assuming response structure contains data: { user: {...}, access_token: "..." }
      if (response && response.data) {
        setAuth(response.data.user, response.data.access_token);
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      console.error("Login failed", err);
      setErrorMsg(err.response?.data?.message || "Failed to log in");
    }
  };

  const handleGuestLogin = () => {
    setAuth(
      {
        id: "guest-001",
        email: "guest@mechamind.io",
        first_name: "Demo",
        last_name: "User",
        organization_id: "00000000-0000-0000-0000-000000000000",
        role: "demo",
        permissions: ["*.view", "documents.upload", "chat.send"],
      },
      "demo-token-abc123"
    );
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1220] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 mb-4 hover:bg-[#3B82F6]/20 transition-colors">
            <Cpu size={28} className="text-[#3B82F6]" />
          </Link>
          <h1 className="text-2xl font-bold text-white">MechaMind OS 2.0</h1>
          <p className="text-sm text-gray-400 mt-1">Sign in to your account</p>
          <Link to="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors mt-2 inline-block">
            &larr; Back to home
          </Link>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-8 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg">
                {errorMsg}
              </div>
            )}
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

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-[#3B82F6] hover:text-blue-400 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              Continue as Guest (Demo)
            </button>
            <p className="text-center text-xs text-gray-600 mt-2">
              No backend required. Uses demo data.
            </p>
          </div>

          <p className="text-center text-sm text-gray-400 mt-4">
            Don't have an account?{" "}
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

export default LoginPage;

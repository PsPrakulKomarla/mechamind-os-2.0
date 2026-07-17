import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useLoginMutation } from "@/hooks/useAuthQueries";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

const loginSchema = zod.object({
  email: zod.string().email("Please enter a valid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters")
});

type LoginFields = zod.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const loginMutation = useLoginMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema)
  });

  // Redirect authenticated users to home
  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const onSubmit = (data: LoginFields) => {
    loginMutation.mutate(data, {
      onSuccess: () => navigate("/")
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-bg to-secondary-bg px-4">
      <div className="w-full max-w-md bg-primary-bg/80 backdrop-blur-sm border border-gray-800 rounded-xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Welcome Back</h2>
        {loginMutation.isError && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 text-red-200 rounded text-sm text-center">
            Invalid email or password.
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full bg-primary-bg/60 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent"
              placeholder="operator@mechamind.local"
            />
            {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <input
              {...register("password")}
              type="password"
              className="w-full bg-primary-bg/60 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-accent hover:bg-blue-600 text-white font-medium py-2 rounded transition-colors disabled:opacity-50"
          >
            {loginMutation.isPending ? "Authenticating…" : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-300 text-sm">
          New here? <a href="/register" className="text-accent hover:underline">Create an account</a>
        </p>
      </div>
    </div>
  );
};

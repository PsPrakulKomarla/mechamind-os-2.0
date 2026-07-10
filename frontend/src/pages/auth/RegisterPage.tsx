import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";

const registerSchema = zod.object({
  first_name: zod.string().min(1, "First name is required"),
  last_name: zod.string().min(1, "Last name is required"),
  email: zod.string().email("Please enter a valid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: zod.string().min(6)
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type RegisterFields = zod.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFields) => {
    try {
      await authService.register({
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name
      });
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-bg px-4">
      <div className="w-full max-w-md bg-secondary-bg border border-gray-800 rounded-lg p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Create Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">First Name</label>
              <input
                {...register("first_name")}
                className="w-full bg-primary-bg border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent"
              />
              {errors.first_name && <p className="text-xs text-danger mt-1">{errors.first_name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Last Name</label>
              <input
                {...register("last_name")}
                className="w-full bg-primary-bg border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent"
              />
              {errors.last_name && <p className="text-xs text-danger mt-1">{errors.last_name.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full bg-primary-bg border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent"
            />
            {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <input
              {...register("password")}
              type="password"
              className="w-full bg-primary-bg border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent"
            />
            {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Confirm Password</label>
            <input
              {...register("confirmPassword")}
              type="password"
              className="w-full bg-primary-bg border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent"
            />
            {errors.confirmPassword && <p className="text-xs text-danger mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-accent hover:bg-blue-600 text-white font-medium py-2 rounded transition-colors"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

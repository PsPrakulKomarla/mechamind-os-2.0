import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          clsx(
            "inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none disabled:opacity-50",
            {
              "bg-accent hover:bg-blue-600 text-white": variant === "primary",
              "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700": variant === "secondary",
              "bg-danger hover:bg-red-600 text-white": variant === "danger",
              "bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white": variant === "ghost",
              "text-xs px-2.5 py-1.5": size === "sm",
              "text-sm px-4 py-2": size === "md",
              "text-base px-6 py-3": size === "lg",
            }
          ),
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

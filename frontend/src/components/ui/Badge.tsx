import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "secondary";
}

export const Badge = ({ className, variant = "secondary", ...props }: BadgeProps) => {
  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider",
          {
            "bg-success/20 text-success border border-success/30": variant === "success",
            "bg-warning/20 text-warning border border-warning/30": variant === "warning",
            "bg-danger/20 text-danger border border-danger/30": variant === "danger",
            "bg-info/20 text-info border border-info/30": variant === "info",
            "bg-gray-800 text-gray-400 border border-gray-700": variant === "secondary" || variant === "default",
          }
        ),
        className
      )}
      {...props}
    />
  );
};

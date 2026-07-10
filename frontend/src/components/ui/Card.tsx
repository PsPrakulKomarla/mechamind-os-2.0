import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={twMerge(
        "bg-secondary-bg border border-gray-800 rounded-lg p-6 shadow-lg",
        className
      )}
      {...props}
    />
  );
};

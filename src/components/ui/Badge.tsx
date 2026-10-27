import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  className = "",
}) => {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold";

  const variantStyles = {
    success: "bg-[#eaf8ee] text-[#137333] border border-[#c6eccd]",
    warning: "bg-[#fff8e6] text-[#b06000] border border-[#ffe099]",
    danger: "bg-[#fff0f2] text-[#c13515] border border-[#ffd1da]",
    info: "bg-[#e8f2ff] text-[#1a73e8] border border-[#c2dcff]",
    neutral: "bg-[#f7f7f7] text-[#3f3f3f] border border-[#dddddd]",
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

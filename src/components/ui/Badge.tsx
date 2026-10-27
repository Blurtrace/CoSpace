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
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider";

  const variantStyles = {
    success: "bg-[#1ed760]/15 text-[#1ed760] border border-[#1ed760]/30",
    warning: "bg-[#ffa42b]/15 text-[#ffa42b] border border-[#ffa42b]/30",
    danger: "bg-[#f3727f]/15 text-[#f3727f] border border-[#f3727f]/30",
    info: "bg-[#539df5]/15 text-[#539df5] border border-[#539df5]/30",
    neutral: "bg-[#282828] text-[#b3b3b3] border border-[#4d4d4d]",
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};


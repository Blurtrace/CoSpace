import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-xl",
    lg: "px-7 py-3.5 text-base rounded-xl",
  };

  const variantStyles = {
    primary: "bg-[#ff385c] text-white hover:bg-[#e00b41] active:scale-[0.98] shadow-sm hover:shadow",
    secondary: "bg-white text-[#222222] border border-[#222222] hover:bg-[#f7f7f7] active:scale-[0.98]",
    outline: "border border-[#dddddd] text-[#222222] bg-white hover:border-[#222222] hover:bg-[#f7f7f7]",
    danger: "bg-[#c13515] text-white hover:bg-[#b32505] active:scale-[0.98]",
    ghost: "bg-transparent text-[#222222] hover:bg-[#f7f7f7]",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="h-4 w-4 animate-spin text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

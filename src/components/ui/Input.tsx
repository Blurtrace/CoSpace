import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex w-full flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-[#222222]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#222222] placeholder-[#929292] transition-all focus:outline-none ${
            error
              ? "border-[#c13515] focus:border-[#c13515] focus:ring-1 focus:ring-[#c13515]"
              : "border-[#dddddd] focus:border-[#222222] focus:ring-1 focus:ring-[#222222]"
          } disabled:cursor-not-allowed disabled:bg-[#f7f7f7] disabled:opacity-50 ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs font-medium text-[#c13515]">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#6a6a6a]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

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
          <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-wider text-[#b3b3b3]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-md border bg-[#1f1f1f] px-3.5 py-2.5 text-sm text-white placeholder-[#7c7c7c] transition-colors focus:outline-none ${
            error
              ? "border-[#f3727f] focus:border-[#f3727f] focus:ring-1 focus:ring-[#f3727f]"
              : "border-[#4d4d4d] focus:border-white focus:ring-1 focus:ring-white"
          } disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs font-medium text-[#f3727f]">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#7c7c7c]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";


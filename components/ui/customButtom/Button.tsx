"use client";

import React from "react";
import type { ButtonHTMLAttributes, CSSProperties } from "react";

type VariantType =
  | "primary"
  | "success"
  | "danger"
  | "dark"
  | "light"
  | "theme"
  | "silver"
  | "transparent"
  | "successTrans";

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: any;
  icon?: React.ReactNode;
  variant?: VariantType;
  className?: string;
  style?: CSSProperties;
  dot?: boolean;
}

const variantClasses: Record<VariantType, string> = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  success: "bg-green-600 hover:bg-green-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  dark: "bg-gray-800 hover:bg-gray-900 text-white",
  light: "bg-gray-100 hover:bg-gray-200 text-gray-800",
  theme: "bg-indigo-600 hover:bg-indigo-700 text-white",
  silver: "bg-gray-300 hover:bg-gray-400 text-gray-900",
  transparent:
    "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100",
  successTrans:
    "bg-green-50 text-green-700 border border-green-500 hover:bg-green-100",
};

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  icon,
  variant = "primary",
  className = "",
  style,
  dot = false,
  type = "button",
  onClick,
  ...rest
}) => {
  const variantStyle = variantClasses[variant] || variantClasses.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${variantStyle} ${className}`}
      style={style}
      {...rest}
    >
      {/* Icon (optional) */}
      {icon && <span className="flex items-center">{icon}</span>}

      {/* Text with optional dot */}
      {text && (
        <span className="flex items-center gap-1">
          {dot && (
            <span className="w-2 h-2 bg-current rounded-full inline-block"></span>
          )}
          {text}
        </span>
      )}
    </button>
  );
};

export default CustomButton;

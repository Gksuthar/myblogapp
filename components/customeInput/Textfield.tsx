'use client'
import React, { ChangeEventHandler, FocusEventHandler, KeyboardEventHandler } from "react";

interface Props {
  label?: string;
  type?: string;
  name?: string;
  id?: string;
  required?: boolean;
  IconProp?: React.ElementType;
  EyeIconProp?: React.ElementType;
  className?: string;
  size?: "sm" | "lg";
  placeholder?: string;
  style?: React.CSSProperties;
  width?: string;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onKeyUp?: KeyboardEventHandler<HTMLInputElement>;
  readOnly?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  multiline?: boolean;
  disabled?: boolean;
  tabIndex?: number;
  step?: number;
  autoFocus?: boolean;
  onInput?: ChangeEventHandler<HTMLInputElement>;
  suffix?: React.ReactNode;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  inputGroupLeft?: React.ReactNode;
  inputGroupRight?: React.ReactNode;
}

const Textfield: React.FC<Props> = ({
  label,
  type = "text",
  name,
  id,
  required,
  IconProp,
  EyeIconProp,
  placeholder,
  style,
  width,
  value,
  onChange,
  onBlur,
  readOnly,
  maxLength,
  minLength,
  min,
  max,
  onKeyDown,
  onKeyUp,
  multiline,
  disabled,
  tabIndex,
  step,
  autoFocus,
  onInput,
  suffix,
  onFocus,
  inputGroupLeft,
  inputGroupRight,
  size,
  className,
}) => {
  const sizeClasses =
    size === "sm"
      ? "h-9 text-sm px-3"
      : size === "lg"
      ? "h-12 text-base px-4"
      : "h-10 text-sm px-3";

  return (
    <div className="w-full" style={{ width }}>
      <div className="relative flex flex-col">
        {label && (
          <label
            htmlFor={id}
            className={`text-gray-600 font-medium text-xs mb-1 ${
              required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""
            }`}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {inputGroupLeft && (
            <div className="px-2 text-gray-500 flex items-center border border-r-0 border-gray-300 rounded-l-md bg-gray-100">
              {inputGroupLeft}
            </div>
          )}

          <input
            type={type}
            name={name}
            id={id}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            readOnly={readOnly}
            min={min}
            max={max}
            step={step}
            autoFocus={autoFocus}
            disabled={disabled}
            tabIndex={tabIndex}
            maxLength={maxLength}
            minLength={minLength}
            placeholder={placeholder}
            onInput={onInput}
            onFocus={onFocus}
            className={`w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400 ${sizeClasses} ${
              IconProp ? "pl-9" : ""
            } ${EyeIconProp ? "pr-9" : ""} ${inputGroupLeft ? "rounded-l-none" : ""} ${
              inputGroupRight ? "rounded-r-none" : ""
            } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${className || ""}`}
            style={style}
            autoComplete="off"
          />

          {IconProp && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <IconProp className="w-4 h-4" />
            </div>
          )}

          {EyeIconProp && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer">
              <EyeIconProp className="w-4 h-4" />
            </div>
          )}

          {inputGroupRight && (
            <div className="px-2 text-gray-500 flex items-center border border-l-0 border-gray-300 rounded-r-md bg-gray-100">
              {inputGroupRight}
            </div>
          )}

          {suffix && (
            <div className="absolute right-1 top-1/2 -translate-y-1/2 bg-gray-100 border border-gray-300 text-gray-600 text-xs font-semibold rounded-md px-2 py-1">
              {suffix}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Textfield;

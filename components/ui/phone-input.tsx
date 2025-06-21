"use client";

import React from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function EnhancedPhoneInput({
  value,
  onChange,
  placeholder = "Enter phone number",
  disabled = false,
  className,
}: PhoneInputProps) {
  return (
    <PhoneInput
      international
      countryCallingCodeEditable={false}
      defaultCountry="US"
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={
        {
          "--PhoneInputCountryFlag-height": "1em",
          "--PhoneInputCountrySelectArrow-color":
            "hsl(var(--muted-foreground))",
          "--PhoneInput-color--focus": "hsl(var(--ring))",
        } as React.CSSProperties
      }
    />
  );
}

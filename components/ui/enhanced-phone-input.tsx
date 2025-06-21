"use client";

import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import classNames from "classnames";
import { Label } from "./label";

interface EnhancedPhoneInputProps {
  value?: string;
  onChange: (phone: string, country?: any) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  defaultCountry?: string;
  autoDetectCountry?: boolean;
}

export const EnhancedPhoneInput: React.FC<EnhancedPhoneInputProps> = ({
  value = "",
  onChange,
  placeholder = "Enter phone number",
  label,
  required = false,
  disabled = false,
  className,
  defaultCountry = "us",
  autoDetectCountry = true,
}) => {
  const [detectedCountry, setDetectedCountry] =
    useState<string>(defaultCountry);
  const [isDetecting, setIsDetecting] = useState(false);

  // Auto-detect country based on IP
  const detectCountry = async () => {
    if (!autoDetectCountry) return;

    setIsDetecting(true);
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      if (data.country_code) {
        setDetectedCountry(data.country_code.toLowerCase());
      }
    } catch (error) {
      console.warn("Failed to detect country for phone input:", error);
    } finally {
      setIsDetecting(false);
    }
  };

  useEffect(() => {
    detectCountry();
  }, [autoDetectCountry]);

  const handleChange = (phone: string, country: any) => {
    onChange(phone, country);
  };

  return (
    <div className={classNames("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-medium flex items-center gap-2">
          {label}
          {required && <span className="text-red-500">*</span>}
          {isDetecting && (
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin" />
              Detecting...
            </div>
          )}
        </Label>
      )}

      <div className="enhanced-phone-input">
        <PhoneInput
          country={detectedCountry}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          inputProps={{
            required: required,
            className: classNames(
              "form-control",
              "w-full",
              "pl-12",
              "pr-3",
              "py-3",
              "text-sm",
              "border",
              "border-gray-300",
              "rounded-md",
              "focus:outline-none",
              "focus:ring-1",
              "focus:ring-blue-500",
              "focus:border-blue-500",
              "disabled:bg-gray-50",
              "disabled:text-gray-500",
              {
                "border-red-300 focus:ring-red-500 focus:border-red-500":
                  required && !value,
              }
            ),
          }}
          buttonClass={classNames(
            "flag-dropdown",
            "border",
            "border-gray-300",
            "rounded-l-md",
            "bg-gray-50",
            "hover:bg-gray-100",
            "focus:outline-none",
            "focus:ring-1",
            "focus:ring-blue-500",
            "focus:border-blue-500",
            {
              "opacity-50 cursor-not-allowed": disabled,
            }
          )}
          dropdownClass="country-dropdown"
          searchClass="search-box"
          inputClass="phone-input"
          containerClass="phone-input-container"
          buttonStyle={{
            border: "1px solid #d1d5db",
            borderRadius: "0.375rem 0 0 0.375rem",
            backgroundColor: "#f9fafb",
            height: "44px",
          }}
          inputStyle={{
            border: "1px solid #d1d5db",
            borderRadius: "0 0.375rem 0.375rem 0",
            height: "44px",
            width: "100%",
            paddingLeft: "48px",
            fontSize: "14px",
          }}
          dropdownStyle={{
            borderRadius: "0.375rem",
            border: "1px solid #d1d5db",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            zIndex: 9999,
          }}
          searchStyle={{
            margin: "8px",
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "0.375rem",
            fontSize: "14px",
          }}
          enableSearch
          disableSearchIcon
          countryCodeEditable={false}
          specialLabel=""
        />
      </div>

      <style jsx global>{`
        .enhanced-phone-input .react-tel-input {
          font-family: inherit;
        }

        .enhanced-phone-input .react-tel-input .flag-dropdown {
          background: #f9fafb !important;
          border: 1px solid #d1d5db !important;
          border-radius: 0.375rem 0 0 0.375rem !important;
        }

        .enhanced-phone-input .react-tel-input .flag-dropdown:hover {
          background: #f3f4f6 !important;
        }

        .enhanced-phone-input .react-tel-input .flag-dropdown.open {
          background: #e5e7eb !important;
        }

        .enhanced-phone-input .react-tel-input .selected-flag {
          padding: 0 12px;
        }

        .enhanced-phone-input .react-tel-input .country-list {
          border-radius: 0.375rem;
          border: 1px solid #d1d5db;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          z-index: 9999;
        }

        .enhanced-phone-input .react-tel-input .country-list .country {
          padding: 8px 12px;
        }

        .enhanced-phone-input .react-tel-input .country-list .country:hover {
          background-color: #eff6ff;
        }

        .enhanced-phone-input
          .react-tel-input
          .country-list
          .country.highlight {
          background-color: #3b82f6;
          color: white;
        }

        .enhanced-phone-input .react-tel-input .form-control {
          border-left: none !important;
        }

        .enhanced-phone-input .react-tel-input .form-control:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 1px #3b82f6 !important;
        }
      `}</style>
    </div>
  );
};

export default EnhancedPhoneInput;

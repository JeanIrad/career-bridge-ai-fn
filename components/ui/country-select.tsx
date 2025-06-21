"use client";

import React, { useState, useEffect } from "react";
import Select from "react-select";
import { cn } from "@/lib/utils";

interface Country {
  value: string;
  label: string;
  code: string;
}

interface City {
  value: string;
  label: string;
}

interface CountrySelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

interface CitySelectProps {
  countryCode?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// Basic country list - we'll enhance this with API later
const COUNTRIES: Country[] = [
  { value: "US", label: "United States", code: "US" },
  { value: "CA", label: "Canada", code: "CA" },
  { value: "GB", label: "United Kingdom", code: "GB" },
  { value: "AU", label: "Australia", code: "AU" },
  { value: "DE", label: "Germany", code: "DE" },
  { value: "FR", label: "France", code: "FR" },
  { value: "IN", label: "India", code: "IN" },
  { value: "BD", label: "Bangladesh", code: "BD" },
  { value: "PK", label: "Pakistan", code: "PK" },
  { value: "JP", label: "Japan", code: "JP" },
  { value: "CN", label: "China", code: "CN" },
  { value: "BR", label: "Brazil", code: "BR" },
  { value: "MX", label: "Mexico", code: "MX" },
  { value: "IT", label: "Italy", code: "IT" },
  { value: "ES", label: "Spain", code: "ES" },
  { value: "NL", label: "Netherlands", code: "NL" },
  { value: "SE", label: "Sweden", code: "SE" },
  { value: "NO", label: "Norway", code: "NO" },
  { value: "DK", label: "Denmark", code: "DK" },
  { value: "FI", label: "Finland", code: "FI" },
  // Add more countries as needed
];

// City data by country - we'll enhance this with API
const CITIES_BY_COUNTRY: Record<string, City[]> = {
  US: [
    { value: "New York", label: "New York" },
    { value: "Los Angeles", label: "Los Angeles" },
    { value: "Chicago", label: "Chicago" },
    { value: "Houston", label: "Houston" },
    { value: "Phoenix", label: "Phoenix" },
    { value: "Philadelphia", label: "Philadelphia" },
    { value: "San Antonio", label: "San Antonio" },
    { value: "San Diego", label: "San Diego" },
    { value: "Dallas", label: "Dallas" },
    { value: "San Jose", label: "San Jose" },
  ],
  CA: [
    { value: "Toronto", label: "Toronto" },
    { value: "Montreal", label: "Montreal" },
    { value: "Vancouver", label: "Vancouver" },
    { value: "Calgary", label: "Calgary" },
    { value: "Edmonton", label: "Edmonton" },
    { value: "Ottawa", label: "Ottawa" },
    { value: "Winnipeg", label: "Winnipeg" },
    { value: "Quebec City", label: "Quebec City" },
  ],
  BD: [
    { value: "Dhaka", label: "Dhaka" },
    { value: "Chittagong", label: "Chittagong" },
    { value: "Sylhet", label: "Sylhet" },
    { value: "Rajshahi", label: "Rajshahi" },
    { value: "Khulna", label: "Khulna" },
    { value: "Barisal", label: "Barisal" },
    { value: "Rangpur", label: "Rangpur" },
    { value: "Mymensingh", label: "Mymensingh" },
  ],
  // Add more cities for other countries as needed
};

export function CountrySelect({
  value,
  onChange,
  placeholder = "Select country",
  disabled = false,
  className,
}: CountrySelectProps) {
  const [countries, setCountries] = useState<Country[]>(COUNTRIES);

  // TODO: Implement API integration for comprehensive country list
  useEffect(() => {
    // For now, we'll use the static list
    // Later, we can integrate with REST Countries API or similar
    setCountries(COUNTRIES);
  }, []);

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: "40px",
      borderColor: state.isFocused ? "hsl(var(--ring))" : "hsl(var(--border))",
      boxShadow: state.isFocused ? "0 0 0 2px hsl(var(--ring))" : "none",
      "&:hover": {
        borderColor: "hsl(var(--border))",
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "hsl(var(--primary))"
        : state.isFocused
          ? "hsl(var(--accent))"
          : "transparent",
      color: state.isSelected
        ? "hsl(var(--primary-foreground))"
        : "hsl(var(--foreground))",
    }),
  };

  return (
    <div className={className}>
      <Select
        value={countries.find((country) => country.value === value)}
        onChange={(selected) => onChange?.(selected?.value || "")}
        options={countries}
        placeholder={placeholder}
        isDisabled={disabled}
        isSearchable
        styles={customStyles}
        className="react-select-container"
        classNamePrefix="react-select"
      />
    </div>
  );
}

export function CitySelect({
  countryCode,
  value,
  onChange,
  placeholder = "Select city",
  disabled = false,
  className,
}: CitySelectProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (countryCode) {
      setLoading(true);
      // For now, use static data
      const countryCities = CITIES_BY_COUNTRY[countryCode] || [];
      setCities(countryCities);
      setLoading(false);

      // TODO: Implement API integration for comprehensive city list
      // Example: Fetch from GeoNames API or similar
      // fetchCitiesForCountry(countryCode).then(setCities);
    } else {
      setCities([]);
    }
  }, [countryCode]);

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: "40px",
      borderColor: state.isFocused ? "hsl(var(--ring))" : "hsl(var(--border))",
      boxShadow: state.isFocused ? "0 0 0 2px hsl(var(--ring))" : "none",
      "&:hover": {
        borderColor: "hsl(var(--border))",
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "hsl(var(--primary))"
        : state.isFocused
          ? "hsl(var(--accent))"
          : "transparent",
      color: state.isSelected
        ? "hsl(var(--primary-foreground))"
        : "hsl(var(--foreground))",
    }),
  };

  return (
    <div className={className}>
      <Select
        value={cities.find((city) => city.value === value)}
        onChange={(selected) => onChange?.(selected?.value || "")}
        options={cities}
        placeholder={countryCode ? placeholder : "Select country first"}
        isDisabled={disabled || !countryCode}
        isSearchable
        isLoading={loading}
        styles={customStyles}
        className="react-select-container"
        classNamePrefix="react-select"
        noOptionsMessage={() =>
          countryCode
            ? "No cities found. You can type to add custom city."
            : "Please select a country first"
        }
      />
    </div>
  );
}

// TODO: Implement API integration functions
/*
async function fetchCountries(): Promise<Country[]> {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
    const data = await response.json();
    return data.map((country: any) => ({
      value: country.cca2,
      label: country.name.common,
      code: country.cca2,
    })).sort((a: Country, b: Country) => a.label.localeCompare(b.label));
  } catch (error) {
    console.error('Failed to fetch countries:', error);
    return COUNTRIES;
  }
}

async function fetchCitiesForCountry(countryCode: string): Promise<City[]> {
  try {
    // Using GeoNames API or similar
    const response = await fetch(
      `http://api.geonames.org/searchJSON?country=${countryCode}&featureClass=P&maxRows=100&username=your_username`
    );
    const data = await response.json();
    return data.geonames?.map((city: any) => ({
      value: city.name,
      label: city.name,
    })) || [];
  } catch (error) {
    console.error('Failed to fetch cities:', error);
    return CITIES_BY_COUNTRY[countryCode] || [];
  }
}
*/

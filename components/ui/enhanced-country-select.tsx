"use client";

import React, { useState, useEffect, useMemo } from "react";
import Select, { components, SingleValue, ActionMeta } from "react-select";
import Flag from "react-world-flags";
import { getData } from "country-list";
import classNames from "classnames";
import { Label } from "./label";

interface CountryOption {
  value: string;
  label: string;
  code: string;
  callingCode: string;
  flag: string;
}

interface LocationData {
  country: string;
  city: string;
  region: string;
  timezone: string;
  ip: string;
}

interface EnhancedCountrySelectProps {
  value?: string;
  onChange: (
    country: string,
    countryCode: string,
    locationData?: LocationData
  ) => void;
  onCityChange?: (city: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  autoDetectLocation?: boolean;
  showCityInput?: boolean;
}

// Custom Option component with flag
const CustomOption = (props: any) => {
  const { data, ...rest } = props;
  return (
    <components.Option {...rest}>
      <div className="flex items-center gap-3">
        <Flag
          code={data.code}
          style={{ width: 20, height: 15 }}
          className="rounded-sm"
        />
        <span className="font-medium">{data.label}</span>
        <span className="text-sm text-gray-500 ml-auto">
          +{data.callingCode}
        </span>
      </div>
    </components.Option>
  );
};

// Custom SingleValue component with flag
const CustomSingleValue = (props: any) => {
  const { data, ...rest } = props;
  return (
    <components.SingleValue {...rest}>
      <div className="flex items-center gap-2">
        <Flag
          code={data.code}
          style={{ width: 20, height: 15 }}
          className="rounded-sm"
        />
        <span>{data.label}</span>
      </div>
    </components.SingleValue>
  );
};

export const EnhancedCountrySelect: React.FC<EnhancedCountrySelectProps> = ({
  value,
  onChange,
  onCityChange,
  placeholder = "Select country...",
  label,
  required = false,
  disabled = false,
  className,
  autoDetectLocation = true,
  showCityInput = false,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
    null
  );
  const [detectedLocation, setDetectedLocation] = useState<LocationData | null>(
    null
  );
  const [isDetecting, setIsDetecting] = useState(false);
  const [city, setCity] = useState("");

  // Create country options
  const countryOptions: CountryOption[] = useMemo(() => {
    const countries = getData();
    return countries
      .map((country) => {
        // Basic calling codes mapping (you can extend this as needed)
        const callingCodes: Record<string, string> = {
          US: "1",
          CA: "1",
          GB: "44",
          DE: "49",
          FR: "33",
          ES: "34",
          IT: "39",
          JP: "81",
          AU: "61",
          BR: "55",
          IN: "91",
          CN: "86",
          MX: "52",
          RU: "7",
          KR: "82",
          NL: "31",
          BE: "32",
          CH: "41",
          AT: "43",
          SE: "46",
          NO: "47",
          DK: "45",
          FI: "358",
          PL: "48",
          TR: "90",
          GR: "30",
          PT: "351",
          CZ: "420",
          HU: "36",
          RO: "40",
          BG: "359",
          HR: "385",
          SI: "386",
          SK: "421",
          EE: "372",
          LV: "371",
          LT: "370",
          IE: "353",
          IS: "354",
          MT: "356",
          CY: "357",
          LU: "352",
          AD: "376",
          MC: "377",
          SM: "378",
          VA: "379",
          LI: "423",
          MK: "389",
          AL: "355",
          ME: "382",
          RS: "381",
          BA: "387",
          XK: "383",
          MD: "373",
          UA: "380",
          BY: "375",
          GE: "995",
          AM: "374",
          AZ: "994",
          KZ: "7",
          UZ: "998",
          TM: "993",
          TJ: "992",
          KG: "996",
          MN: "976",
          AF: "93",
          PK: "92",
          BD: "880",
          LK: "94",
          MV: "960",
          NP: "977",
          BT: "975",
          MM: "95",
          TH: "66",
          LA: "856",
          KH: "855",
          VN: "84",
          MY: "60",
          SG: "65",
          BN: "673",
          ID: "62",
          TL: "670",
          PH: "63",
          PG: "675",
          SB: "677",
          VU: "678",
          NC: "687",
          FJ: "679",
          PW: "680",
          WS: "685",
          KI: "686",
          TO: "676",
          TV: "688",
          NR: "674",
          MH: "692",
          FM: "691",
          GU: "1671",
          MP: "1670",
          AS: "1684",
          PF: "689",
          WF: "681",
          CK: "682",
          NU: "683",
          TK: "690",
          PN: "870",
          NZ: "64",
          NF: "672",
          CX: "61",
          CC: "61",
          HM: "672",
          AQ: "672",
          TF: "262",
          IO: "246",
          UM: "1",
          VI: "1340",
          PR: "1787",
          BM: "1441",
          GL: "299",
          FO: "298",
          SJ: "47",
          AX: "358",
          GG: "44",
          JE: "44",
          IM: "44",
          GI: "350",
          FK: "500",
          SH: "290",
          AC: "247",
          TA: "290",
          SC: "248",
          MU: "230",
          RE: "262",
          YT: "262",
          KM: "269",
          MG: "261",
          ZA: "27",
          LS: "266",
          SZ: "268",
          BW: "267",
          NA: "264",
          ZM: "260",
          ZW: "263",
          MW: "265",
          MZ: "258",
          TZ: "255",
          KE: "254",
          UG: "256",
          RW: "250",
          BI: "257",
          DJ: "253",
          SO: "252",
          ET: "251",
          ER: "291",
          SD: "249",
          SS: "211",
          EG: "20",
          LY: "218",
          TN: "216",
          DZ: "213",
          MA: "212",
          EH: "212",
          MR: "222",
          ML: "223",
          BF: "226",
          NE: "227",
          NG: "234",
          TD: "235",
          CF: "236",
          CM: "237",
          GQ: "240",
          GA: "241",
          CG: "242",
          CD: "243",
          AO: "244",
          GW: "245",
          CV: "238",
          ST: "239",
          GH: "233",
          TG: "228",
          BJ: "229",
          NR: "674",
          CI: "225",
          SL: "232",
          LR: "231",
          GM: "220",
          GN: "224",
          SN: "221",
          MV: "960",
          IL: "972",
          PS: "970",
          JO: "962",
          SY: "963",
          LB: "961",
          IQ: "964",
          KW: "965",
          SA: "966",
          YE: "967",
          OM: "968",
          AE: "971",
          QA: "974",
          BH: "973",
          IR: "98",
          UY: "598",
          PY: "595",
          SR: "597",
          GY: "592",
          EC: "593",
          CO: "57",
          VE: "58",
          BO: "591",
          PE: "51",
          CL: "56",
          AR: "54",
          FK: "500",
          BZ: "501",
          CR: "506",
          PA: "507",
          HN: "504",
          GT: "502",
          SV: "503",
          NI: "505",
          CU: "53",
          HT: "509",
          DO: "1809",
          JM: "1876",
          TT: "1868",
          BB: "1246",
          LC: "1758",
          VC: "1784",
          GD: "1473",
          AG: "1268",
          DM: "1767",
          KN: "1869",
          AI: "1264",
          MS: "1664",
          VG: "1284",
          TC: "1649",
          KY: "1345",
          BS: "1242",
          CW: "599",
          AW: "297",
          BQ: "599",
          SX: "1721",
          MF: "590",
          BL: "590",
          GP: "590",
          MQ: "596",
        };

        return {
          value: country.name,
          label: country.name,
          code: country.code,
          callingCode: callingCodes[country.code] || "1",
          flag: country.code.toLowerCase(),
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  // Auto-detect location using IP
  const detectLocation = async () => {
    if (!autoDetectLocation) return;

    setIsDetecting(true);
    try {
      const response = await fetch(
        `https://ipinfo.io/json?token=${process.env.NEXT_PUBLIC_IPINFO_TOKEN}`
      );
      const data = await response.json();

      const locationData: LocationData = {
        country: data.country_name || data.country,
        city: data.city,
        region: data.region,
        timezone: data.timezone,
        ip: data.ip,
      };

      setDetectedLocation(locationData);

      // Find matching country option
      const matchingCountry = countryOptions.find(
        (option) =>
          option.label.toLowerCase() === locationData.country.toLowerCase() ||
          option.code === data.country
      );

      if (matchingCountry && !value) {
        setSelectedCountry(matchingCountry);
        onChange(matchingCountry.label, matchingCountry.code, locationData);
      }

      if (locationData.city && showCityInput) {
        setCity(locationData.city);
        onCityChange?.(locationData.city);
      }
    } catch (error) {
      console.warn("Failed to detect location:", error);
      // Fallback to a free service
      try {
        const fallbackResponse = await fetch("https://ipapi.co/json/");
        const fallbackData = await fallbackResponse.json();

        const locationData: LocationData = {
          country: fallbackData.country_name,
          city: fallbackData.city,
          region: fallbackData.region,
          timezone: fallbackData.timezone,
          ip: fallbackData.ip,
        };

        setDetectedLocation(locationData);

        const matchingCountry = countryOptions.find(
          (option) =>
            option.label.toLowerCase() === locationData.country.toLowerCase() ||
            option.code === fallbackData.country_code?.toUpperCase()
        );

        if (matchingCountry && !value) {
          setSelectedCountry(matchingCountry);
          onChange(matchingCountry.label, matchingCountry.code, locationData);
        }

        if (locationData.city && showCityInput) {
          setCity(locationData.city);
          onCityChange?.(locationData.city);
        }
      } catch (fallbackError) {
        console.warn("Fallback location detection also failed:", fallbackError);
      }
    } finally {
      setIsDetecting(false);
    }
  };

  // Effect to detect location on mount
  useEffect(() => {
    detectLocation();
  }, [autoDetectLocation]);

  // Effect to update selected country when value prop changes
  useEffect(() => {
    if (value) {
      const matchingCountry = countryOptions.find(
        (option) => option.value === value || option.label === value
      );
      if (matchingCountry) {
        setSelectedCountry(matchingCountry);
      }
    }
  }, [value, countryOptions]);

  const handleChange = (
    newValue: SingleValue<CountryOption>,
    actionMeta: ActionMeta<CountryOption>
  ) => {
    setSelectedCountry(newValue);
    if (newValue) {
      onChange(newValue.label, newValue.code, detectedLocation || undefined);
    }
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: "44px",
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#3b82f6" : "#9ca3af",
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
          ? "#eff6ff"
          : "white",
      color: state.isSelected ? "white" : "#374151",
      padding: "12px 16px",
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
    }),
    menuList: (provided: any) => ({
      ...provided,
      maxHeight: "200px",
    }),
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
              Detecting location...
            </div>
          )}
        </Label>
      )}

      <Select<CountryOption>
        value={selectedCountry}
        onChange={handleChange}
        options={countryOptions}
        components={{
          Option: CustomOption,
          SingleValue: CustomSingleValue,
        }}
        styles={customStyles}
        placeholder={placeholder}
        isDisabled={disabled}
        isSearchable
        isClearable
        menuPortalTarget={
          typeof document !== "undefined" ? document.body : null
        }
        menuPosition="fixed"
        classNamePrefix="react-select"
      />

      {detectedLocation && (
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          Auto-detected from {detectedLocation.city}, {detectedLocation.country}
        </div>
      )}

      {showCityInput && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">City</Label>
          <input
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              onCityChange?.(e.target.value);
            }}
            placeholder="Enter city..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
};

export default EnhancedCountrySelect;

"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  UserPlus,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  User,
  GraduationCap,
  Briefcase,
  Shield,
  X,
  Plus,
  Loader2,
} from "lucide-react";
import { useCreateUser } from "../../lib/actions/admin-users";
import { toast } from "sonner";
import EnhancedCountrySelect from "../ui/enhanced-country-select";
import EnhancedPhoneInput from "../ui/enhanced-phone-input";
import classNames from "classnames";
import Flag from "react-world-flags";
import { getData } from "country-list";
import PhoneInput from "react-phone-input-2";

interface LocationData {
  country: string;
  city: string;
  region: string;
  timezone: string;
  ip: string;
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
}) => {
  const createUserMutation = useCreateUser();

  // Form state
  const [userType, setUserType] = useState<string>("");
  const [currentSkill, setCurrentSkill] = useState("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [detectedLocation, setDetectedLocation] = useState<LocationData | null>(
    null
  );
  const [formData, setFormData] = useState({
    // Basic Information
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    role: "",

    // Location Information
    country: "",
    countryCode: "",
    state: "",
    city: "",
    zipCode: "",

    // IP Detection metadata
    detectedFromIp: false,
    ipAddress: "",

    // Organization Information
    organizationName: "",
    organizationWebsite: "",
    organizationDescription: "",
    organizationSize: "",
    industry: "",

    // Role & Permissions
    jobTitle: "",
    department: "",

    // University Specific
    universityType: "",
    accreditation: "",
    university: "",

    // Enhanced Company Fields for Employers
    companyName: "",
    companyType: "Private",
    foundedYear: new Date().getFullYear(),
    companyDescription: "",
    companyWebsite: "",
    companyIndustry: "",
    companySize: "",
    companyAddress: "",
    companyCity: "",
    companyState: "",
    companyCountry: "",
    companyPhone: "",
    companyEmail: "",
    companyLinkedIn: "",
    companyTwitter: "",
    companyFacebook: "",
    createCompany: false,

    // Admin Specific
    adminLevel: "",
    permissions: [] as string[],

    // Account Settings
    sendWelcomeEmail: true,
    requirePasswordReset: true,
    isVerified: false,

    // Student specific
    major: "",
    graduationYear: new Date().getFullYear() + 1,
    headline: "",
    bio: "",

    // Specializations
    specializations: [] as string[],
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        role: "",
        country: "",
        countryCode: "",
        state: "",
        city: "",
        zipCode: "",
        detectedFromIp: false,
        ipAddress: "",
        organizationName: "",
        organizationWebsite: "",
        organizationDescription: "",
        organizationSize: "",
        industry: "",
        jobTitle: "",
        department: "",
        universityType: "",
        accreditation: "",
        university: "",
        companyName: "",
        companyType: "Private",
        foundedYear: new Date().getFullYear(),
        companyDescription: "",
        companyWebsite: "",
        companyIndustry: "",
        companySize: "",
        companyAddress: "",
        companyCity: "",
        companyState: "",
        companyCountry: "",
        companyPhone: "",
        companyEmail: "",
        companyLinkedIn: "",
        companyTwitter: "",
        companyFacebook: "",
        createCompany: false,
        adminLevel: "",
        permissions: [],
        sendWelcomeEmail: true,
        requirePasswordReset: true,
        isVerified: false,
        major: "",
        graduationYear: new Date().getFullYear() + 1,
        headline: "",
        bio: "",
        specializations: [],
      });
      setUserType("");
      setCurrentSkill("");
      setPhoneError("");
      setDetectedLocation(null);
    }
  }, [isOpen]);

  // Update role when user type changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, role: userType }));

    // Auto-enable company creation for employers
    if (userType === "EMPLOYER") {
      setFormData((prev) => ({ ...prev, createCompany: true }));
    } else {
      setFormData((prev) => ({ ...prev, createCompany: false }));
    }
  }, [userType]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCountryChange = (
    country: string,
    countryCode: string,
    locationData?: LocationData
  ) => {
    setFormData((prev) => ({
      ...prev,
      country,
      countryCode,
      detectedFromIp: !!locationData,
      ipAddress: locationData?.ip || "",
    }));

    if (locationData) {
      setDetectedLocation(locationData);
      setFormData((prev) => ({
        ...prev,
        city: locationData.city,
        state: locationData.region,
      }));
    }
  };

  const handlePhoneChange = (phone: string, country?: any) => {
    setFormData((prev) => ({
      ...prev,
      phoneNumber: phone,
      countryCode: country?.countryCode?.toUpperCase() || prev.countryCode,
    }));

    // Validate phone number
    validatePhoneNumber(phone);
  };

  const validatePhoneNumber = (phone: string) => {
    setPhoneError("");

    if (!phone) {
      // Phone is optional, so empty is valid
      return;
    }

    // Remove all non-digit characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, "");

    // Check if it matches the international format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (!phoneRegex.test(cleanPhone)) {
      setPhoneError(
        "Please enter a valid phone number with country code (e.g., +250787308777)"
      );
      return;
    }

    // Check specific length constraints
    if (cleanPhone.length < 8) {
      setPhoneError("Phone number is too short");
      return;
    }

    if (cleanPhone.length > 16) {
      setPhoneError("Phone number is too long");
      return;
    }

    // Rwanda specific validation (+250 followed by 9 digits)
    if (cleanPhone.startsWith("+250") && cleanPhone.length !== 13) {
      setPhoneError(
        "Rwandan phone numbers should be 13 digits including +250 (e.g., +250787308777)"
      );
      return;
    }

    setPhoneError("");
  };

  const handleCompanyCountryChange = (
    country: string,
    countryCode: string,
    locationData?: LocationData
  ) => {
    setFormData((prev) => ({
      ...prev,
      companyCountry: country,
    }));
  };

  const addSpecialization = () => {
    if (
      currentSkill.trim() &&
      !formData.specializations.includes(currentSkill.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        specializations: [...prev.specializations, currentSkill.trim()],
      }));
      setCurrentSkill("");
    }
  };

  const removeSpecialization = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userType) {
      toast.error("Please select a user type");
      return;
    }

    // Check for phone validation errors
    if (phoneError) {
      toast.error("Please fix the phone number error before submitting");
      return;
    }

    // Build payload based on user type
    const basePayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: userType,
      // Location fields
      country: formData.country,
      state: formData.state,
      city: formData.city,
      // Account settings
      sendWelcomeEmail: formData.sendWelcomeEmail,
      requirePasswordReset: formData.requirePasswordReset,
      isVerified: formData.isVerified,
    };

    // Add optional fields only if they have values
    const payload: any = { ...basePayload };

    // Phone number - only add if not empty
    if (formData.phoneNumber && formData.phoneNumber.trim()) {
      payload.phoneNumber = formData.phoneNumber;
    }

    // ZIP code - only add if not empty
    if (formData.zipCode && formData.zipCode.trim()) {
      payload.zipCode = formData.zipCode;
    }

    // Add user type specific fields
    if (userType === "EMPLOYER") {
      // Add the createCompany flag
      payload.createCompany = formData.createCompany;

      // Only add company fields if creating company profile
      if (formData.createCompany) {
        if (formData.companyName) payload.companyName = formData.companyName;
        if (formData.companyType) payload.companyType = formData.companyType;
        if (formData.companyIndustry)
          payload.companyIndustry = formData.companyIndustry;
        if (formData.companySize) payload.companySize = formData.companySize;
        if (formData.companyDescription)
          payload.companyDescription = formData.companyDescription;
        if (formData.companyCountry)
          payload.companyCountry = formData.companyCountry;
        if (formData.companyCity) payload.companyCity = formData.companyCity;
        if (formData.companyState) payload.companyState = formData.companyState;
        if (formData.companyAddress)
          payload.companyAddress = formData.companyAddress;

        // Optional company fields - only add if not empty and valid
        if (
          formData.companyWebsite &&
          formData.companyWebsite.trim() &&
          formData.companyWebsite.startsWith("http")
        ) {
          payload.companyWebsite = formData.companyWebsite;
        }
        if (
          formData.companyEmail &&
          formData.companyEmail.trim() &&
          formData.companyEmail.includes("@")
        ) {
          payload.companyEmail = formData.companyEmail;
        }
        if (formData.companyPhone && formData.companyPhone.trim()) {
          payload.companyPhone = formData.companyPhone;
        }
        if (
          formData.companyLinkedIn &&
          formData.companyLinkedIn.trim() &&
          formData.companyLinkedIn.startsWith("http")
        ) {
          payload.companyLinkedIn = formData.companyLinkedIn;
        }
        if (
          formData.companyTwitter &&
          formData.companyTwitter.trim() &&
          formData.companyTwitter.startsWith("http")
        ) {
          payload.companyTwitter = formData.companyTwitter;
        }
        if (
          formData.companyFacebook &&
          formData.companyFacebook.trim() &&
          formData.companyFacebook.startsWith("http")
        ) {
          payload.companyFacebook = formData.companyFacebook;
        }
        if (
          formData.foundedYear &&
          formData.foundedYear !== new Date().getFullYear()
        ) {
          payload.foundedYear = parseInt(formData.foundedYear.toString(), 10);
        }
      }

      // Employer specific fields
      if (formData.specializations && formData.specializations.length > 0) {
        payload.specializations = formData.specializations;
      }
    } else if (userType === "PROFESSOR" || userType === "UNIVERSITY_STAFF") {
      // University fields
      if (formData.university) payload.university = formData.university;
      if (formData.department) payload.department = formData.department;
      if (formData.jobTitle) payload.jobTitle = formData.jobTitle;
    } else if (userType === "ADMIN") {
      // Admin fields
      if (formData.adminLevel) payload.adminLevel = formData.adminLevel;
      if (formData.permissions && formData.permissions.length > 0) {
        payload.permissions = formData.permissions;
      }
    }

    try {
      console.log("Submitting user creation with payload:", payload);
      console.log("User type:", userType);
      console.log("Create company flag:", formData.createCompany);

      await createUserMutation.mutateAsync(payload);
      toast.success("User created successfully!");
      onClose();
    } catch (error: any) {
      console.error("Failed to create user:", error);
      const errorMessage = error?.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        toast.error(`Validation errors: ${errorMessage.join(", ")}`);
      } else {
        toast.error(errorMessage || "Failed to create user");
      }
    }
  };

  const isLoading = createUserMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[98vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="w-6 h-6" />
            Create New User Account
          </DialogTitle>
          <DialogDescription className="text-base">
            Create accounts for employers, university staff, or administrators.
            Students can register themselves through the public registration.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* User Type Selection */}
          <div className="space-y-5">
            <Label className="text-lg font-semibold border-b pb-3 block">
              Select User Type *
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  value: "EMPLOYER",
                  label: "Employer",
                  icon: Briefcase,
                  color: "bg-blue-50 border-blue-200 text-blue-700",
                },
                {
                  value: "PROFESSOR",
                  label: "Professor",
                  icon: GraduationCap,
                  color: "bg-green-50 border-green-200 text-green-700",
                },
                {
                  value: "UNIVERSITY_STAFF",
                  label: "University Staff",
                  icon: Building2,
                  color: "bg-purple-50 border-purple-200 text-purple-700",
                },
                {
                  value: "ADMIN",
                  label: "Administrator",
                  icon: Shield,
                  color: "bg-orange-50 border-orange-200 text-orange-700",
                },
              ].map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setUserType(type.value)}
                    className={classNames(
                      "p-3 border-2 rounded-lg transition-all duration-200 hover:shadow-md text-center",
                      userType === type.value
                        ? `${type.color} border-current shadow-md`
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Icon className="w-7 h-7 mx-auto mb-2" />
                    <div className="font-medium text-xs leading-tight">
                      {type.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {userType && (
            <>
              {/* Basic Information */}
              <div className="space-y-5">
                <h3 className="text-lg font-semibold border-b pb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        placeholder="Enter first name"
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        placeholder="Enter last name"
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="Enter email address"
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <EnhancedPhoneInput
                      label="Phone Number (Optional)"
                      value={formData.phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder="Enter phone number"
                      autoDetectCountry={true}
                    />
                    {phoneError && (
                      <p className="text-sm text-red-600 mt-1">{phoneError}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-5">
                <h3 className="text-lg font-semibold border-b pb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <EnhancedCountrySelect
                      label="Country *"
                      value={formData.country}
                      onChange={handleCountryChange}
                      placeholder="Select country..."
                      required
                      autoDetectLocation={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-medium">
                      State/Province (Optional)
                    </Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      placeholder="Enter state or province"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">
                      City *
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      placeholder="Enter city"
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-sm font-medium">
                      ZIP/Postal Code (Optional)
                    </Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) =>
                        handleInputChange("zipCode", e.target.value)
                      }
                      placeholder="Enter ZIP or postal code"
                      className="h-11"
                    />
                  </div>
                </div>

                {detectedLocation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-700 text-sm">
                      <Globe className="w-4 h-4" />
                      <span className="font-medium">
                        Location auto-detected from IP:
                      </span>
                      <span>
                        {detectedLocation.city}, {detectedLocation.country}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Company Information (for Employers) */}
              {userType === "EMPLOYER" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold border-b pb-3 flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Company Information
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="createCompany"
                        checked={formData.createCompany}
                        onCheckedChange={(checked) =>
                          handleInputChange("createCompany", checked)
                        }
                      />
                      <Label htmlFor="createCompany" className="text-sm">
                        Create company profile
                      </Label>
                    </div>
                  </div>

                  {formData.createCompany && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-2">
                        <Label
                          htmlFor="companyName"
                          className="text-sm font-medium"
                        >
                          Company Name *
                        </Label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) =>
                            handleInputChange("companyName", e.target.value)
                          }
                          placeholder="Enter company name"
                          className="h-11"
                          required={formData.createCompany}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="companyType"
                          className="text-sm font-medium"
                        >
                          Company Type
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleInputChange("companyType", value)
                          }
                          value={formData.companyType}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select company type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Private">Private</SelectItem>
                            <SelectItem value="Public">Public</SelectItem>
                            <SelectItem value="Non-profit">
                              Non-profit
                            </SelectItem>
                            <SelectItem value="Government">
                              Government
                            </SelectItem>
                            <SelectItem value="Startup">Startup</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="companyIndustry"
                          className="text-sm font-medium"
                        >
                          Industry
                        </Label>
                        <Input
                          id="companyIndustry"
                          value={formData.companyIndustry}
                          onChange={(e) =>
                            handleInputChange("companyIndustry", e.target.value)
                          }
                          placeholder="e.g., Technology, Healthcare"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="companySize"
                          className="text-sm font-medium"
                        >
                          Company Size
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleInputChange("companySize", value)
                          }
                          value={formData.companySize}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select company size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">
                              11-50 employees
                            </SelectItem>
                            <SelectItem value="51-200">
                              51-200 employees
                            </SelectItem>
                            <SelectItem value="201-500">
                              201-500 employees
                            </SelectItem>
                            <SelectItem value="501-1000">
                              501-1000 employees
                            </SelectItem>
                            <SelectItem value="1000+">
                              1000+ employees
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="foundedYear"
                          className="text-sm font-medium"
                        >
                          Founded Year
                        </Label>
                        <Input
                          id="foundedYear"
                          type="number"
                          min="1800"
                          max={new Date().getFullYear()}
                          value={formData.foundedYear}
                          onChange={(e) =>
                            handleInputChange(
                              "foundedYear",
                              parseInt(e.target.value)
                            )
                          }
                          placeholder="e.g., 2010"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="companyWebsite"
                          className="text-sm font-medium"
                        >
                          Website
                        </Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="companyWebsite"
                            type="url"
                            value={formData.companyWebsite}
                            onChange={(e) =>
                              handleInputChange(
                                "companyWebsite",
                                e.target.value
                              )
                            }
                            placeholder="https://company.com"
                            className="pl-10 h-11"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label
                          htmlFor="companyDescription"
                          className="text-sm font-medium"
                        >
                          Company Description
                        </Label>
                        <Textarea
                          id="companyDescription"
                          value={formData.companyDescription}
                          onChange={(e) =>
                            handleInputChange(
                              "companyDescription",
                              e.target.value
                            )
                          }
                          placeholder="Brief description of the company..."
                          rows={3}
                        />
                      </div>

                      {/* Company Contact Information */}
                      <div className="md:col-span-2">
                        <Separator className="my-4" />
                        <h4 className="font-medium text-sm mb-4">
                          Company Contact Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="companyEmail"
                              className="text-sm font-medium"
                            >
                              Company Email
                            </Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                id="companyEmail"
                                type="email"
                                value={formData.companyEmail}
                                onChange={(e) =>
                                  handleInputChange(
                                    "companyEmail",
                                    e.target.value
                                  )
                                }
                                placeholder="contact@company.com"
                                className="pl-10 h-11"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="companyPhone"
                              className="text-sm font-medium"
                            >
                              Company Phone
                            </Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                id="companyPhone"
                                value={formData.companyPhone}
                                onChange={(e) =>
                                  handleInputChange(
                                    "companyPhone",
                                    e.target.value
                                  )
                                }
                                placeholder="+1 (555) 123-4567"
                                className="pl-10 h-11"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Company Address */}
                      <div className="md:col-span-2">
                        <Separator className="my-4" />
                        <h4 className="font-medium text-sm mb-4">
                          Company Address
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="companyAddress"
                              className="text-sm font-medium"
                            >
                              Street Address
                            </Label>
                            <Input
                              id="companyAddress"
                              value={formData.companyAddress}
                              onChange={(e) =>
                                handleInputChange(
                                  "companyAddress",
                                  e.target.value
                                )
                              }
                              placeholder="123 Business Street"
                              className="h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="companyCity"
                              className="text-sm font-medium"
                            >
                              City
                            </Label>
                            <Input
                              id="companyCity"
                              value={formData.companyCity}
                              onChange={(e) =>
                                handleInputChange("companyCity", e.target.value)
                              }
                              placeholder="Company city"
                              className="h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="companyState"
                              className="text-sm font-medium"
                            >
                              State/Province
                            </Label>
                            <Input
                              id="companyState"
                              value={formData.companyState}
                              onChange={(e) =>
                                handleInputChange(
                                  "companyState",
                                  e.target.value
                                )
                              }
                              placeholder="Company state"
                              className="h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <EnhancedCountrySelect
                              label="Country"
                              value={formData.companyCountry}
                              onChange={handleCompanyCountryChange}
                              placeholder="Select company country..."
                              autoDetectLocation={false}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Role-specific Information */}
              {userType === "PROFESSOR" && (
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold border-b pb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Academic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="university"
                        className="text-sm font-medium"
                      >
                        University *
                      </Label>
                      <Input
                        id="university"
                        value={formData.university}
                        onChange={(e) =>
                          handleInputChange("university", e.target.value)
                        }
                        placeholder="Enter university name"
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="department"
                        className="text-sm font-medium"
                      >
                        Department
                      </Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) =>
                          handleInputChange("department", e.target.value)
                        }
                        placeholder="e.g., Computer Science"
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Specializations/Skills (for employers) */}
              {userType === "EMPLOYER" && (
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold border-b pb-3">
                    Specializations
                  </h3>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Areas of Expertise
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        placeholder="Add specialization (e.g., Software Development)"
                        className="h-11"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSpecialization();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={addSpecialization}
                        size="sm"
                        variant="outline"
                        className="h-11 px-4"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {formData.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.specializations.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-3 py-1 text-sm"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSpecialization(skill)}
                              className="ml-2 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Account Settings */}
              <div className="space-y-5">
                <h3 className="text-lg font-semibold border-b pb-3">
                  Account Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="sendWelcomeEmail"
                      checked={formData.sendWelcomeEmail}
                      onCheckedChange={(checked) =>
                        handleInputChange("sendWelcomeEmail", checked)
                      }
                    />
                    <Label htmlFor="sendWelcomeEmail" className="text-sm">
                      Send welcome email with password setup link
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="requirePasswordReset"
                      checked={formData.requirePasswordReset}
                      onCheckedChange={(checked) =>
                        handleInputChange("requirePasswordReset", checked)
                      }
                    />
                    <Label htmlFor="requirePasswordReset" className="text-sm">
                      Require password setup on first login
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="isVerified"
                      checked={formData.isVerified}
                      onCheckedChange={(checked) =>
                        handleInputChange("isVerified", checked)
                      }
                    />
                    <Label htmlFor="isVerified" className="text-sm">
                      Mark account as verified
                    </Label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create User
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

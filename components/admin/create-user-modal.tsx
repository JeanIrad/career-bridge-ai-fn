"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  Building2,
  School,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
// import { useToast } from "@/hooks/use-toast";

interface CreateUserModalProps {
  trigger?: React.ReactNode;
}

export function CreateUserModal({ trigger }: CreateUserModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<"employer" | "university" | "">("");
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  //   const { toast } = useToast();

  const [formData, setFormData] = useState({
    // Basic Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // Organization Information
    organizationName: "",
    organizationWebsite: "",
    organizationDescription: "",
    organizationSize: "",
    industry: "",

    // Location
    country: "",
    state: "",
    city: "",

    // Role & Permissions
    jobTitle: "",
    department: "",
    sendWelcomeEmail: true,
    requirePasswordReset: true,

    // University Specific
    universityType: "",
    accreditation: "",

    // Employer Specific
    companyType: "",
    foundedYear: "",
    specializations: [] as string[],
  });

  const handleInputChange = (
    field: string,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      const newSkills = [...skills, currentSkill.trim()];
      setSkills(newSkills);
      handleInputChange("specializations", newSkills);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(newSkills);
    handleInputChange("specializations", newSkills);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(
        `${formData.firstName} ${formData.lastName} has been added as a ${userType}.`
      );

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        organizationName: "",
        organizationWebsite: "",
        organizationDescription: "",
        organizationSize: "",
        industry: "",
        country: "",
        state: "",
        city: "",
        jobTitle: "",
        department: "",
        sendWelcomeEmail: true,
        requirePasswordReset: true,
        universityType: "",
        accreditation: "",
        companyType: "",
        foundedYear: "",
        specializations: [],
      });
      setSkills([]);
      setUserType("");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = (
    <Button>
      <UserPlus className="w-4 h-4 mr-2" />
      Create User
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Create New User Account
          </DialogTitle>
          <DialogDescription>
            Create employer or university staff accounts. Students can register
            themselves through the public registration.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Account Type *</Label>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  userType === "employer"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setUserType("employer")}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Employer Account</h3>
                    <p className="text-sm text-muted-foreground">
                      For company representatives and recruiters
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  userType === "university"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setUserType("university")}
              >
                <div className="flex items-center gap-3">
                  <School className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">University Staff</h3>
                    <p className="text-sm text-muted-foreground">
                      For university administrators and career services
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {userType && (
            <>
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="Enter email address"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="Enter phone number"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Organization Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  {userType === "employer" ? "Company" : "University"}{" "}
                  Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">
                      {userType === "employer" ? "Company" : "University"} Name
                      *
                    </Label>
                    <Input
                      id="organizationName"
                      value={formData.organizationName}
                      onChange={(e) =>
                        handleInputChange("organizationName", e.target.value)
                      }
                      placeholder={`Enter ${userType === "employer" ? "company" : "university"} name`}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organizationWebsite">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="organizationWebsite"
                        value={formData.organizationWebsite}
                        onChange={(e) =>
                          handleInputChange(
                            "organizationWebsite",
                            e.target.value
                          )
                        }
                        placeholder="https://example.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {userType === "employer" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry *</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("industry", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="manufacturing">
                            Manufacturing
                          </SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyType">Company Type</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("companyType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select company type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="startup">Startup</SelectItem>
                          <SelectItem value="small">Small Business</SelectItem>
                          <SelectItem value="medium">
                            Medium Enterprise
                          </SelectItem>
                          <SelectItem value="large">
                            Large Corporation
                          </SelectItem>
                          <SelectItem value="nonprofit">Non-profit</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {userType === "university" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="universityType">University Type</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("universityType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select university type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">
                            Public University
                          </SelectItem>
                          <SelectItem value="private">
                            Private University
                          </SelectItem>
                          <SelectItem value="community">
                            Community College
                          </SelectItem>
                          <SelectItem value="technical">
                            Technical Institute
                          </SelectItem>
                          <SelectItem value="research">
                            Research University
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accreditation">Accreditation</Label>
                      <Input
                        id="accreditation"
                        value={formData.accreditation}
                        onChange={(e) =>
                          handleInputChange("accreditation", e.target.value)
                        }
                        placeholder="e.g., AACSB, ABET"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="organizationDescription">Description</Label>
                  <Textarea
                    id="organizationDescription"
                    value={formData.organizationDescription}
                    onChange={(e) =>
                      handleInputChange(
                        "organizationDescription",
                        e.target.value
                      )
                    }
                    placeholder={`Brief description of the ${userType === "employer" ? "company" : "university"}`}
                    rows={3}
                  />
                </div>
              </div>

              {/* Role Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Role Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title *</Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) =>
                        handleInputChange("jobTitle", e.target.value)
                      }
                      placeholder="e.g., HR Manager, Career Counselor"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) =>
                        handleInputChange("department", e.target.value)
                      }
                      placeholder="e.g., Human Resources, Career Services"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Location
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("country", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      placeholder="Enter state/province"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      placeholder="Enter city"
                    />
                  </div>
                </div>
              </div>

              {/* Specializations/Skills (for employers) */}
              {userType === "employer" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Specializations
                  </h3>
                  <div className="space-y-2">
                    <Label>Areas of Expertise</Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        placeholder="Add specialization (e.g., Software Development)"
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addSkill())
                        }
                      />
                      <Button
                        type="button"
                        onClick={addSkill}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {skill}
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-red-500"
                              onClick={() => removeSkill(skill)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Account Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Account Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Send Welcome Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Send account creation notification to the user
                      </p>
                    </div>
                    <Switch
                      checked={formData.sendWelcomeEmail}
                      onCheckedChange={(checked) =>
                        handleInputChange("sendWelcomeEmail", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Password Reset</Label>
                      <p className="text-sm text-muted-foreground">
                        User must set their own password on first login
                      </p>
                    </div>
                    <Switch
                      checked={formData.requirePasswordReset}
                      onCheckedChange={(checked) =>
                        handleInputChange("requirePasswordReset", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!userType || loading}
            className="min-w-[120px]"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </div>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Create User
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

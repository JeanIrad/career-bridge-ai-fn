"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  User,
  Edit,
  Save,
  Camera,
  MapPin,
  Calendar,
  Globe,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Bell,
  Palette,
  Languages,
  Heart,
  Briefcase,
  GraduationCap,
  Award,
  Settings,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  getCurrentUser,
  updateUserProfile,
  changePassword,
  uploadAvatar,
  type UserProfile,
  type UpdateUserProfileData,
  type ChangePasswordData,
} from "@/lib/api-user-profile";

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
  "Japan",
  "South Korea",
  "Singapore",
  "Netherlands",
  "Sweden",
  "Switzerland",
  "Denmark",
  "Norway",
  "Finland",
  "New Zealand",
  "Ireland",
  "Belgium",
  "Austria",
  "Other",
];

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Dutch",
  "Russian",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Bengali",
  "Other",
];

const INTERESTS = [
  "Technology",
  "Innovation",
  "Leadership",
  "Startups",
  "AI/ML",
  "Data Science",
  "Cybersecurity",
  "Cloud Computing",
  "Mobile Development",
  "Web Development",
  "DevOps",
  "Product Management",
  "Digital Marketing",
  "E-commerce",
  "Fintech",
  "Healthcare Tech",
  "EdTech",
  "Sustainability",
  "Remote Work",
  "Diversity & Inclusion",
];

export function EmployerProfile() {
  const { user: currentUser, loading: userLoading } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateUserProfileData>({});

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Load profile data
  useEffect(() => {
    if (currentUser) {
      loadProfile();
    }
  }, [currentUser]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getCurrentUser();
      setProfile(response.data);
    } catch (error) {
      toast.error("Failed to load profile");
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      const response = await updateUserProfile(editData);
      setProfile(response.data);
      setIsEditing(false);
      setEditData({});
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    try {
      setIsLoading(true);
      await changePassword(passwordData);
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password changed successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      setIsLoading(true);
      const response = await uploadAvatar(file);
      setProfile((prev) =>
        prev ? { ...prev, avatar: response.data.avatar } : null
      );
      toast.success("Profile picture updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload profile picture");
    } finally {
      setIsLoading(false);
    }
  };

  const getProfileCompletionScore = (): number => {
    if (!profile) return 0;

    const fields = [
      profile.firstName,
      profile.lastName,
      profile.email,
      profile.headline,
      profile.bio,
      profile.phoneNumber,
      profile.city,
      profile.country,
      profile.avatar,
      profile.dateOfBirth,
      profile.languages?.length,
      profile.interests?.length,
    ];

    const filledFields = fields.filter(
      (field) =>
        field && (typeof field === "string" ? field.trim() !== "" : field > 0)
    ).length;

    return Math.round((filledFields / fields.length) * 100);
  };

  const startEditing = () => {
    if (!profile) return;

    setEditData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      headline: profile.headline,
      bio: profile.bio,
      phoneNumber: profile.phoneNumber,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      zipCode: profile.zipCode,
      country: profile.country,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      nationality: profile.nationality,
      languages: profile.languages,
      interests: profile.interests,
      socialLinks: profile.socialLinks,
      isPublic: profile.isPublic,
      visibility: profile.visibility,
    });
    setIsEditing(true);
  };

  if (userLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== "EMPLOYER") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">
            This page is only available to employers.
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Profile Not Found</h3>
          <p className="text-muted-foreground">
            Unable to load your profile information.
          </p>
          <Button onClick={loadProfile} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employer Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {getProfileCompletionScore()}%
            </div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
          <Progress value={getProfileCompletionScore()} className="w-24" />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Profile Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                {/* Profile Picture */}
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={`${profile.firstName} ${profile.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      `${profile.firstName?.charAt(0)}${profile.lastName?.charAt(0)}`
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          handleAvatarUpload(file);
                        }
                      };
                      input.click();
                    }}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>

                {/* Basic Info */}
                <div>
                  <h3 className="font-semibold text-lg">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  {profile.headline && (
                    <p className="text-sm text-muted-foreground">
                      {profile.headline}
                    </p>
                  )}
                  <Badge variant="secondary" className="mt-2">
                    Employer
                  </Badge>
                </div>

                {/* Quick Stats */}
                <div className="space-y-2 text-sm">
                  {profile.city && profile.country && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {profile.city}, {profile.country}
                      </span>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{profile.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Joined {new Date(profile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Profile Status */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">
                      Verified Account
                    </span>
                  </div>
                  <Progress
                    value={getProfileCompletionScore()}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Profile {getProfileCompletionScore()}% complete
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="contact">Contact & Location</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Your basic personal details and professional information
                      </CardDescription>
                    </div>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={() => {
                        if (isEditing) {
                          handleUpdateProfile();
                        } else {
                          startEditing();
                        }
                      }}
                      disabled={isLoading}
                    >
                      {isLoading && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      {isEditing ? (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={
                          isEditing
                            ? editData.firstName || ""
                            : profile.firstName
                        }
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={
                          isEditing ? editData.lastName || "" : profile.lastName
                        }
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {/* Professional Headline */}
                  <div className="space-y-2">
                    <Label htmlFor="headline">Professional Headline</Label>
                    <Input
                      id="headline"
                      value={
                        isEditing
                          ? editData.headline || ""
                          : profile.headline || ""
                      }
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          headline: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      placeholder="e.g., Senior Talent Acquisition Manager at Tech Corp"
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={isEditing ? editData.bio || "" : profile.bio || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      placeholder="Tell us about your professional background and what you're looking for in candidates..."
                    />
                  </div>

                  {/* Personal Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={
                          isEditing
                            ? editData.dateOfBirth
                              ? editData.dateOfBirth.includes("T")
                                ? editData.dateOfBirth.split("T")[0]
                                : editData.dateOfBirth
                              : ""
                            : profile.dateOfBirth
                              ? profile.dateOfBirth.includes("T")
                                ? profile.dateOfBirth.split("T")[0]
                                : profile.dateOfBirth
                              : ""
                        }
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            dateOfBirth: e.target.value || undefined,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      {isEditing ? (
                        <Select
                          value={editData.gender || ""}
                          onValueChange={(value) =>
                            setEditData((prev) => ({
                              ...prev,
                              gender: value as any,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input value={profile.gender || ""} disabled />
                      )}
                    </div>
                  </div>

                  {/* Nationality */}
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      value={
                        isEditing
                          ? editData.nationality || ""
                          : profile.nationality || ""
                      }
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          nationality: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      placeholder="e.g., American, Canadian, British"
                    />
                  </div>

                  {/* Languages */}
                  <div className="space-y-2">
                    <Label>Languages</Label>
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {LANGUAGES.map((lang) => (
                            <Button
                              key={lang}
                              variant={
                                editData.languages?.includes(lang)
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => {
                                const currentLangs = editData.languages || [];
                                if (currentLangs.includes(lang)) {
                                  setEditData((prev) => ({
                                    ...prev,
                                    languages: currentLangs.filter(
                                      (l) => l !== lang
                                    ),
                                  }));
                                } else {
                                  setEditData((prev) => ({
                                    ...prev,
                                    languages: [...currentLangs, lang],
                                  }));
                                }
                              }}
                            >
                              {lang}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.languages?.map((lang) => (
                          <Badge key={lang} variant="secondary">
                            {lang}
                          </Badge>
                        )) || (
                          <span className="text-muted-foreground">
                            No languages specified
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Interests */}
                  <div className="space-y-2">
                    <Label>Professional Interests</Label>
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {INTERESTS.map((interest) => (
                            <Button
                              key={interest}
                              variant={
                                editData.interests?.includes(interest)
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => {
                                const currentInterests =
                                  editData.interests || [];
                                if (currentInterests.includes(interest)) {
                                  setEditData((prev) => ({
                                    ...prev,
                                    interests: currentInterests.filter(
                                      (i) => i !== interest
                                    ),
                                  }));
                                } else {
                                  setEditData((prev) => ({
                                    ...prev,
                                    interests: [...currentInterests, interest],
                                  }));
                                }
                              }}
                            >
                              {interest}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.interests?.map((interest) => (
                          <Badge key={interest} variant="secondary">
                            {interest}
                          </Badge>
                        )) || (
                          <span className="text-muted-foreground">
                            No interests specified
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact & Location Tab */}
            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Your contact details and location information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email & Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed. Contact support if needed.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={
                          isEditing
                            ? editData.phoneNumber || ""
                            : profile.phoneNumber || ""
                        }
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            phoneNumber: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={
                        isEditing
                          ? editData.address || ""
                          : profile.address || ""
                      }
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      placeholder="123 Main Street"
                    />
                  </div>

                  {/* City, State, Zip */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={
                          isEditing ? editData.city || "" : profile.city || ""
                        }
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        placeholder="San Francisco"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        value={
                          isEditing ? editData.state || "" : profile.state || ""
                        }
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            state: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        placeholder="California"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                      <Input
                        id="zipCode"
                        value={
                          isEditing
                            ? editData.zipCode || ""
                            : profile.zipCode || ""
                        }
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            zipCode: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        placeholder="94102"
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    {isEditing ? (
                      <Select
                        value={editData.country || ""}
                        onValueChange={(value) =>
                          setEditData((prev) => ({ ...prev, country: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={profile.country || ""} disabled />
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="space-y-4">
                    <Label>Social Media Links</Label>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                        <Input
                          id="linkedin"
                          value={
                            isEditing
                              ? (editData.socialLinks as any)?.linkedin || ""
                              : (profile.socialLinks as any)?.linkedin || ""
                          }
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              socialLinks: {
                                ...(prev.socialLinks as any),
                                linkedin: e.target.value,
                              },
                            }))
                          }
                          disabled={!isEditing}
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter Profile</Label>
                        <Input
                          id="twitter"
                          value={
                            isEditing
                              ? (editData.socialLinks as any)?.twitter || ""
                              : (profile.socialLinks as any)?.twitter || ""
                          }
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              socialLinks: {
                                ...(prev.socialLinks as any),
                                twitter: e.target.value,
                              },
                            }))
                          }
                          disabled={!isEditing}
                          placeholder="https://twitter.com/yourusername"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Personal Website</Label>
                        <Input
                          id="website"
                          value={
                            isEditing
                              ? (editData.socialLinks as any)?.website || ""
                              : (profile.socialLinks as any)?.website || ""
                          }
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              socialLinks: {
                                ...(prev.socialLinks as any),
                                website: e.target.value,
                              },
                            }))
                          }
                          disabled={!isEditing}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy & Visibility Settings</CardTitle>
                  <CardDescription>
                    Control who can see your profile and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Public Profile</Label>
                        <p className="text-sm text-muted-foreground">
                          Make your profile visible to students and other users
                        </p>
                      </div>
                      <Switch
                        checked={
                          isEditing
                            ? (editData.isPublic ?? true)
                            : profile.isPublic
                        }
                        onCheckedChange={(checked) =>
                          setEditData((prev) => ({
                            ...prev,
                            isPublic: checked,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Profile Visibility</Label>
                      {isEditing ? (
                        <Select
                          value={editData.visibility || profile.visibility}
                          onValueChange={(value) =>
                            setEditData((prev) => ({
                              ...prev,
                              visibility: value as any,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PUBLIC">
                              Public - Visible to everyone
                            </SelectItem>
                            <SelectItem value="CONNECTIONS">
                              Connections - Only to connected users
                            </SelectItem>
                            <SelectItem value="PRIVATE">
                              Private - Only to you
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input value={profile.visibility} disabled />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Job Application Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when candidates apply to your jobs
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Message Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when you receive new messages
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Event Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminded about upcoming events and deadlines
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Communications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about new features and tips
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password & Security</CardTitle>
                  <CardDescription>
                    Manage your account security and authentication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Change Password */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Password</h4>
                        <p className="text-sm text-muted-foreground">
                          Last changed:{" "}
                          {new Date(profile.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                    </div>

                    {showPasswordForm && (
                      <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">
                            Current Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showPasswords.current ? "text" : "password"}
                              value={passwordData.currentPassword}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  currentPassword: e.target.value,
                                }))
                              }
                              placeholder="Enter current password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() =>
                                setShowPasswords((prev) => ({
                                  ...prev,
                                  current: !prev.current,
                                }))
                              }
                            >
                              {showPasswords.current ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showPasswords.new ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  newPassword: e.target.value,
                                }))
                              }
                              placeholder="Enter new password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() =>
                                setShowPasswords((prev) => ({
                                  ...prev,
                                  new: !prev.new,
                                }))
                              }
                            >
                              {showPasswords.new ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">
                            Confirm New Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showPasswords.confirm ? "text" : "password"}
                              value={passwordData.confirmPassword}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  confirmPassword: e.target.value,
                                }))
                              }
                              placeholder="Confirm new password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() =>
                                setShowPasswords((prev) => ({
                                  ...prev,
                                  confirm: !prev.confirm,
                                }))
                              }
                            >
                              {showPasswords.confirm ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={handleChangePassword}
                            disabled={
                              isLoading ||
                              !passwordData.currentPassword ||
                              !passwordData.newPassword ||
                              !passwordData.confirmPassword
                            }
                          >
                            {isLoading && (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            Update Password
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowPasswordForm(false);
                              setPasswordData({
                                currentPassword: "",
                                newPassword: "",
                                confirmPassword: "",
                              });
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Account Status */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Account Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Email Verified</span>
                        </div>
                        <Badge variant="default">Verified</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Account Security</span>
                        </div>
                        <Badge variant="secondary">Good</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">Profile Completeness</span>
                        </div>
                        <Badge variant="secondary">
                          {getProfileCompletionScore()}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Edit,
  Save,
  Camera,
  Plus,
  X,
  GraduationCap,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Award,
  Briefcase,
  FileText,
  Download,
  Upload,
  Building2,
  Star,
  Search,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Code,
  Users,
  Target,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { getToken, getStoredUser, isAuthenticated } from "@/lib/auth-utils";
import { useUploadResume } from "@/hooks/use-upload-resume";
import {
  addStudentEducation,
  getStudentEducations,
  updateStudentEducation,
  deleteStudentEducation,
  getUniversities,
  updateUserProfile,
  addSkill,
  removeSkill,
  getCurrentUser,
} from "@/lib/api";

// Education Status Enum
enum EducationStatus {
  CURRENT = "CURRENT",
  COMPLETED = "COMPLETED",
  PAUSED = "PAUSED",
  TRANSFERRED = "TRANSFERRED",
}

// Types
interface University {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  city: string;
  state: string;
  country: string;
  type: string;
  worldRanking?: number;
  isTopTier: boolean;
  popularMajors: string[];
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  headline?: string;
  bio?: string;
  university?: string;
  major?: string;
  graduationYear?: number;
  gpa?: number;
  studentId?: string;
  availability?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  languages: string[];
  interests: string[];
  visibility: "PUBLIC" | "PRIVATE";
  isPublic: boolean;
  socialLinks?: any;
  resume?: string;
  cvUrl?: string;
  skills: Skill[];
  education: Education[];
  experiences: Experience[];
  studentEducations?: StudentEducation[];
}

interface StudentEducation {
  id: string;
  universityId: string;
  university: University;
  degree?: string;
  major?: string;
  minor?: string;
  gpa?: number;
  maxGpa?: number;
  graduationYear?: number;
  startYear?: number;
  status?: EducationStatus;
  activities?: string[];
  honors?: string[];
  isCurrently?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Skill {
  id: string;
  name: string;
  endorsements: number;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  grade?: string;
  startDate: string;
  endDate?: string;
}

interface Experience {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  skills: string[];
}

export function StudentProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [studentEducations, setStudentEducations] = useState<
    StudentEducation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchUniversity, setSearchUniversity] = useState("");
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Education form state
  const [educationForm, setEducationForm] = useState({
    universityId: "",
    degree: "",
    major: "",
    minor: "",
    gpa: "",
    maxGpa: "4.0",
    graduationYear: "",
    startYear: "",
    status: EducationStatus.CURRENT,
    activities: [] as string[],
    honors: [] as string[],
    isCurrently: true,
  });
  const [editingEducationId, setEditingEducationId] = useState<string | null>(
    null
  );
  const [showEducationForm, setShowEducationForm] = useState(false);

  // Add the upload resume hook
  const uploadResumeMutation = useUploadResume();

  // Debug authentication
  useEffect(() => {
    const token = getToken();
    console.log("🔍 StudentProfile Debug Info:");
    console.log("- Token exists:", !!token);
    console.log(
      "- Token preview:",
      token ? `${token.substring(0, 20)}...` : "null"
    );
    console.log("- Loading state:", loading);
    console.log("- Profile state:", !!profile);
  }, [loading, profile]);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      console.log("Fetching current user profile...");
      const response = await getCurrentUser();
      console.log("Profile response:", response);

      // Handle response structure properly
      let profileData = null;
      if (response.success && response.data) {
        profileData = response.data;
      } else if (response.data) {
        profileData = response.data;
      } else if (response.id) {
        // Direct profile data
        profileData = response;
      }

      if (profileData) {
        setProfile(profileData);
        console.log("Profile loaded successfully:", profileData);

        // If user has a university, find it in the list (only if universities are loaded)
        if (profileData.university && universities.length > 0) {
          const uni = universities.find(
            (u) => u.name === profileData.university
          );
          if (uni) setSelectedUniversity(uni);
        }
      } else {
        console.error("No profile data received:", response);
        toast.error("Failed to load profile data");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  // Add timeout for loading state
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("Profile loading timeout - forcing loading to false");
        setLoading(false);
        toast.error("Profile loading timed out. Please refresh the page.");
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [loading]);

  // Fetch universities
  const fetchUniversities = useCallback(async (search = "") => {
    try {
      const response = await getUniversities(search, 50);
      console.log("Universities response:", response);

      // Handle both possible response structures
      let universitiesData = [];
      if (response.success && Array.isArray(response.data)) {
        universitiesData = response.data;
      } else if (Array.isArray(response)) {
        universitiesData = response;
      } else if (response.data && Array.isArray(response.data)) {
        universitiesData = response.data;
      }

      setUniversities(universitiesData);
    } catch (error) {
      console.error("Error fetching universities:", error);
      toast.error("Failed to load universities");
      setUniversities([]);
    }
  }, []);

  // Fetch student education records
  const fetchStudentEducations = useCallback(async () => {
    try {
      const response = await getStudentEducations();
      console.log("Student educations response:", response);

      // Handle both possible response structures
      let educationsData = [];
      if (response.success && Array.isArray(response.data)) {
        educationsData = response.data;
      } else if (Array.isArray(response)) {
        educationsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        educationsData = response.data;
      }

      setStudentEducations(educationsData);
    } catch (error) {
      console.error("Error fetching education records:", error);
      toast.error("Failed to load education records");
      setStudentEducations([]);
    }
  }, []);

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const data = await updateUserProfile(updates);
      setProfile(data.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  // Add skill
  const addSkillHandler = async () => {
    if (!newSkill.trim()) return;

    try {
      const data = await addSkill(newSkill.trim());

      // Update the profile with the new skill
      if (profile) {
        setProfile({
          ...profile,
          skills: [...profile.skills, data.data],
        });
      }

      setNewSkill("");
      toast.success("Skill added successfully");
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error("Failed to add skill");
    }
  };

  // Remove skill
  const removeSkillHandler = async (skillId: string) => {
    try {
      await removeSkill(skillId);

      // Update the profile by removing the skill
      if (profile) {
        setProfile({
          ...profile,
          skills: profile.skills.filter((skill) => skill.id !== skillId),
        });
      }

      toast.success("Skill removed successfully");
    } catch (error) {
      console.error("Error removing skill:", error);
      toast.error("Failed to remove skill");
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!profile) return;

    try {
      const updates = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber,
        headline: profile.headline,
        bio: profile.bio,
        university: selectedUniversity?.name || profile.university,
        major: profile.major,
        graduationYear: profile.graduationYear,
        gpa: profile.gpa,
        studentId: profile.studentId,
        availability: profile.availability,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        zipCode: profile.zipCode,
        country: profile.country,
        languages: profile.languages,
        interests: profile.interests,
        visibility: profile.visibility,
        isPublic: profile.isPublic,
      };

      await updateProfile(updates);
      setIsEditing(false);
    } catch (error) {
      // Error is already handled in updateProfile
    }
  };

  // Calculate profile completion
  const calculateProfileCompletion = () => {
    if (!profile) return 0;

    const fields = [
      profile.firstName,
      profile.lastName,
      profile.email,
      profile.phoneNumber,
      profile.headline,
      profile.bio,
      profile.university,
      profile.major,
      profile.graduationYear,
      profile.resume,
      profile.skills.length > 0,
      studentEducations.length > 0,
    ];

    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  useEffect(() => {
    // Load profile immediately, don't wait for universities
    fetchProfile();
  }, []);

  useEffect(() => {
    // Load universities independently
    fetchUniversities();
  }, [fetchUniversities]);

  useEffect(() => {
    // Load student educations independently
    fetchStudentEducations();
  }, [fetchStudentEducations]);

  useEffect(() => {
    // Re-run university selection when both profile and universities are loaded
    if (universities.length > 0 && profile?.university) {
      const uni = universities.find((u) => u.name === profile.university);
      if (uni) setSelectedUniversity(uni);
    }
  }, [universities, profile]);

  // Filter universities for dropdown
  const filteredUniversities = Array.isArray(universities)
    ? universities.filter(
        (uni) =>
          uni.name.toLowerCase().includes(searchUniversity.toLowerCase()) ||
          uni.shortName.toLowerCase().includes(searchUniversity.toLowerCase())
      )
    : [];

  // Add student education
  const addStudentEducationHandler = async () => {
    if (!educationForm.universityId) {
      toast.error("Please select a university");
      return;
    }

    try {
      setSaving(true);

      const educationData = {
        ...educationForm,
        gpa: educationForm.gpa ? parseFloat(educationForm.gpa) : undefined,
        maxGpa: educationForm.maxGpa
          ? parseFloat(educationForm.maxGpa)
          : undefined,
        graduationYear: educationForm.graduationYear
          ? parseInt(educationForm.graduationYear)
          : undefined,
        startYear: educationForm.startYear
          ? parseInt(educationForm.startYear)
          : undefined,
      };

      const response = await addStudentEducation(educationData);
      const newEducation = response.success ? response.data : response;
      setStudentEducations((prev) => [newEducation, ...prev]);

      // Reset form
      setEducationForm({
        universityId: "",
        degree: "",
        major: "",
        minor: "",
        gpa: "",
        maxGpa: "4.0",
        graduationYear: "",
        startYear: "",
        status: EducationStatus.CURRENT,
        activities: [],
        honors: [],
        isCurrently: true,
      });
      setShowEducationForm(false);
      setSelectedUniversity(null);

      toast.success("Education record added successfully");
    } catch (error) {
      console.error("Error adding education:", error);
      toast.error("Failed to add education record");
    } finally {
      setSaving(false);
    }
  };

  // Update student education
  const updateStudentEducationRecord = async () => {
    if (!editingEducationId) return;

    try {
      setSaving(true);

      const educationData = {
        ...educationForm,
        gpa: educationForm.gpa ? parseFloat(educationForm.gpa) : undefined,
        maxGpa: educationForm.maxGpa
          ? parseFloat(educationForm.maxGpa)
          : undefined,
        graduationYear: educationForm.graduationYear
          ? parseInt(educationForm.graduationYear)
          : undefined,
        startYear: educationForm.startYear
          ? parseInt(educationForm.startYear)
          : undefined,
      };

      const response = await updateStudentEducation(
        editingEducationId,
        educationData
      );
      // Handle response structure properly
      const updatedEducation = response.success ? response.data : response;
      setStudentEducations((prev) =>
        prev.map((edu) =>
          edu.id === editingEducationId ? updatedEducation : edu
        )
      );

      // Reset form
      setEducationForm({
        universityId: "",
        degree: "",
        major: "",
        minor: "",
        gpa: "",
        maxGpa: "4.0",
        graduationYear: "",
        startYear: "",
        status: EducationStatus.CURRENT,
        activities: [],
        honors: [],
        isCurrently: true,
      });
      setEditingEducationId(null);
      setShowEducationForm(false);
      setSelectedUniversity(null);

      toast.success("Education record updated successfully");
    } catch (error) {
      console.error("Error updating education:", error);
      toast.error("Failed to update education record");
    } finally {
      setSaving(false);
    }
  };

  // Delete student education
  const deleteStudentEducationRecord = async (educationId: string) => {
    try {
      await deleteStudentEducation(educationId);
      setStudentEducations((prev) =>
        prev.filter((edu) => edu.id !== educationId)
      );
      toast.success("Education record deleted successfully");
    } catch (error) {
      console.error("Error deleting education:", error);
      toast.error("Failed to delete education record");
    }
  };

  // Replace the handleCVUpload function
  const handleCVUpload = async (file: File) => {
    try {
      // Add debugging
      console.log("Uploading file:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size must be less than 5MB");
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error("Only PDF, DOC, and DOCX files are allowed");
      }

      // Use the mutation hook
      const data = await uploadResumeMutation.mutateAsync(file);
      console.log("Upload response:", data);

      // Update the profile with the resume URL from the uploaded document
      const resumeUrl = data.document?.cloudinaryUrl || data.document?.url;
      data.document?.filePath;

      if (resumeUrl) {
        // Update user profile with the resume URL
        await updateProfile({ resume: resumeUrl });
      }
    } catch (error) {
      console.error("Error uploading CV:", error);
      // Error handling is already done by the mutation hook
    }
  };

  // Edit education record
  const editEducationRecord = (education: StudentEducation) => {
    setEducationForm({
      universityId: education.universityId,
      degree: education.degree || "",
      major: education.major || "",
      minor: education.minor || "",
      gpa: education.gpa?.toString() || "",
      maxGpa: education.maxGpa?.toString() || "4.0",
      graduationYear: education.graduationYear?.toString() || "",
      startYear: education.startYear?.toString() || "",
      status: education.status || EducationStatus.CURRENT,
      activities: education.activities || [],
      honors: education.honors || [],
      isCurrently: education.isCurrently || true,
    });
    setSelectedUniversity(education.university);
    setEditingEducationId(education.id);
    setShowEducationForm(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-2 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load profile</h3>
          <p className="text-muted-foreground mb-4">
            Please try refreshing the page
          </p>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>
    );
  }

  const profileCompletion = calculateProfileCompletion();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile information and career preferences
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          )}
          <Button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={saving}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Profile Completion
          </CardTitle>
          <CardDescription>
            Complete your profile to get better job matches and opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${profile.firstName && profile.lastName ? "bg-emerald-500" : "bg-gray-300"}`}
                ></div>
                <span
                  className={
                    !profile.firstName || !profile.lastName
                      ? "text-muted-foreground"
                      : ""
                  }
                >
                  Basic Info
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${profile.university && profile.major ? "bg-emerald-500" : "bg-gray-300"}`}
                ></div>
                <span
                  className={
                    !profile.university || !profile.major
                      ? "text-muted-foreground"
                      : ""
                  }
                >
                  Education
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${profile.skills.length > 0 ? "bg-emerald-500" : "bg-gray-300"}`}
                ></div>
                <span
                  className={
                    profile.skills.length === 0 ? "text-muted-foreground" : ""
                  }
                >
                  Skills
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${profile.resume ? "bg-emerald-500" : "bg-gray-300"}`}
                ></div>
                <span
                  className={!profile.resume ? "text-muted-foreground" : ""}
                >
                  Resume
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your basic profile information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo & Name */}
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`
                    )}
                  </div>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        value={profile.firstName}
                        onChange={(e) =>
                          setProfile((prev) =>
                            prev ? { ...prev, firstName: e.target.value } : prev
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        value={profile.lastName}
                        onChange={(e) =>
                          setProfile((prev) =>
                            prev ? { ...prev, lastName: e.target.value } : prev
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="headline">Professional Headline</Label>
                    <Input
                      id="headline"
                      value={profile.headline || ""}
                      onChange={(e) =>
                        setProfile((prev) =>
                          prev ? { ...prev, headline: e.target.value } : prev
                        )
                      }
                      disabled={!isEditing}
                      placeholder="e.g., Computer Science Student | Aspiring Software Engineer"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phoneNumber || ""}
                    onChange={(e) =>
                      setProfile((prev) =>
                        prev ? { ...prev, phoneNumber: e.target.value } : prev
                      )
                    }
                    disabled={!isEditing}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio || ""}
                  onChange={(e) =>
                    setProfile((prev) =>
                      prev ? { ...prev, bio: e.target.value } : prev
                    )
                  }
                  disabled={!isEditing}
                  placeholder="Tell us about yourself, your interests, and career goals..."
                  rows={4}
                />
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profile.address || ""}
                    onChange={(e) =>
                      setProfile((prev) =>
                        prev ? { ...prev, address: e.target.value } : prev
                      )
                    }
                    disabled={!isEditing}
                    placeholder="Street address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profile.city || ""}
                    onChange={(e) =>
                      setProfile((prev) =>
                        prev ? { ...prev, city: e.target.value } : prev
                      )
                    }
                    disabled={!isEditing}
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={profile.state || ""}
                    onChange={(e) =>
                      setProfile((prev) =>
                        prev ? { ...prev, state: e.target.value } : prev
                      )
                    }
                    disabled={!isEditing}
                    placeholder="State"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={profile.country || ""}
                    onChange={(e) =>
                      setProfile((prev) =>
                        prev ? { ...prev, country: e.target.value } : prev
                      )
                    }
                    disabled={!isEditing}
                    placeholder="Country"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-6">
          {/* CV Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resume/CV
              </CardTitle>
              <CardDescription>
                Upload your resume or CV to complete your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.resume ? (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium">Resume/CV Uploaded</div>
                        <div className="text-sm text-muted-foreground">
                          {profile.resume.split("/").pop()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = ".pdf,.doc,.docx";
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement)
                              .files?.[0];
                            if (file) {
                              handleCVUpload(file);
                            }
                          };
                          input.click();
                        }}
                        disabled={uploadResumeMutation.isPending}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadResumeMutation.isPending
                          ? "Uploading..."
                          : "Upload CV/Resume"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground mb-3">
                      Upload your resume or CV (PDF, DOC, DOCX)
                    </div>
                    <Button
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = ".pdf,.doc,.docx";
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement)
                            .files?.[0];
                          if (file) {
                            handleCVUpload(file);
                          }
                        };
                        input.click();
                      }}
                      disabled={uploadResumeMutation.isPending}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploadResumeMutation.isPending
                        ? "Uploading..."
                        : "Upload CV/Resume"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Education Records */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </CardTitle>
                  <CardDescription>
                    Your university education and academic achievements
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowEducationForm(true)}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Education
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentEducations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No education records yet</p>
                    <p className="text-sm">
                      Add your university education to get started
                    </p>
                  </div>
                ) : (
                  studentEducations.map((education) => (
                    <div
                      key={education.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">
                              {education.university.name}
                            </h3>
                            {education.university.isTopTier && (
                              <Badge variant="secondary">
                                <Star className="w-3 h-3 mr-1" />
                                Top Tier
                              </Badge>
                            )}
                            {education.isCurrently && (
                              <Badge variant="default">Current</Badge>
                            )}
                          </div>
                          <div className="text-muted-foreground text-sm space-y-1">
                            <p>
                              {education.university.city},{" "}
                              {education.university.state},{" "}
                              {education.university.country}
                            </p>
                            {education.university.worldRanking && (
                              <p>
                                World Ranking: #
                                {education.university.worldRanking}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editEducationRecord(education)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              deleteStudentEducationRecord(education.id)
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {education.degree && (
                          <div>
                            <span className="font-medium">Degree:</span>
                            <p className="text-muted-foreground">
                              {education.degree}
                            </p>
                          </div>
                        )}
                        {education.major && (
                          <div>
                            <span className="font-medium">Major:</span>
                            <p className="text-muted-foreground">
                              {education.major}
                            </p>
                          </div>
                        )}
                        {education.gpa && (
                          <div>
                            <span className="font-medium">GPA:</span>
                            <p className="text-muted-foreground">
                              {education.gpa}/{education.maxGpa || 4.0}
                            </p>
                          </div>
                        )}
                        {education.graduationYear && (
                          <div>
                            <span className="font-medium">Graduation:</span>
                            <p className="text-muted-foreground">
                              {education.graduationYear}
                            </p>
                          </div>
                        )}
                      </div>

                      {education.honors && education.honors.length > 0 && (
                        <div>
                          <span className="font-medium text-sm">Honors:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {education.honors.map((honor, index) => (
                              <Badge key={index} variant="outline">
                                <Award className="w-3 h-3 mr-1" />
                                {honor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Education Form Modal */}
          {showEducationForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingEducationId ? "Edit Education" : "Add Education"}
                </CardTitle>
                <CardDescription>
                  {editingEducationId
                    ? "Update your education information"
                    : "Add your university education details"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* University Selection */}
                <div className="space-y-2">
                  <Label>University *</Label>
                  <div className="relative">
                    <Input
                      value={selectedUniversity?.name || searchUniversity}
                      onChange={(e) => {
                        setSearchUniversity(e.target.value);
                        setShowUniversityDropdown(true);
                        if (e.target.value === "") {
                          setSelectedUniversity(null);
                          setEducationForm((prev) => ({
                            ...prev,
                            universityId: "",
                          }));
                        }
                      }}
                      onFocus={() => setShowUniversityDropdown(true)}
                      placeholder="Search for your university..."
                      className="pr-10"
                    />
                    <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />

                    {showUniversityDropdown &&
                      filteredUniversities.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredUniversities.map((uni) => (
                            <div
                              key={uni.id}
                              className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                              onClick={() => {
                                setSelectedUniversity(uni);
                                setEducationForm((prev) => ({
                                  ...prev,
                                  universityId: uni.id,
                                }));
                                setSearchUniversity("");
                                setShowUniversityDropdown(false);
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{uni.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {uni.city}, {uni.state}, {uni.country}
                                  </div>
                                </div>
                                {uni.isTopTier && (
                                  <Badge variant="secondary">
                                    <Star className="w-3 h-3 mr-1" />
                                    Top Tier
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>

                {/* Education Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <Select
                      value={educationForm.degree}
                      onValueChange={(value) =>
                        setEducationForm((prev) => ({ ...prev, degree: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bachelor's">Bachelor's</SelectItem>
                        <SelectItem value="Master's">Master's</SelectItem>
                        <SelectItem value="PhD">PhD</SelectItem>
                        <SelectItem value="Associate">Associate</SelectItem>
                        <SelectItem value="Certificate">Certificate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Major</Label>
                    <Input
                      value={educationForm.major}
                      onChange={(e) =>
                        setEducationForm((prev) => ({
                          ...prev,
                          major: e.target.value,
                        }))
                      }
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>GPA</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={educationForm.gpa}
                      onChange={(e) =>
                        setEducationForm((prev) => ({
                          ...prev,
                          gpa: e.target.value,
                        }))
                      }
                      placeholder="3.75"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max GPA</Label>
                    <Select
                      value={educationForm.maxGpa}
                      onValueChange={(value) =>
                        setEducationForm((prev) => ({ ...prev, maxGpa: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4.0">4.0</SelectItem>
                        <SelectItem value="5.0">5.0</SelectItem>
                        <SelectItem value="10.0">10.0</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Year</Label>
                    <Input
                      type="number"
                      value={educationForm.startYear}
                      onChange={(e) =>
                        setEducationForm((prev) => ({
                          ...prev,
                          startYear: e.target.value,
                        }))
                      }
                      placeholder="2020"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Graduation Year</Label>
                    <Input
                      type="number"
                      value={educationForm.graduationYear}
                      onChange={(e) =>
                        setEducationForm((prev) => ({
                          ...prev,
                          graduationYear: e.target.value,
                        }))
                      }
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={educationForm.status}
                    onValueChange={(value) =>
                      setEducationForm((prev) => ({
                        ...prev,
                        status: value as EducationStatus,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={EducationStatus.CURRENT}>
                        Current
                      </SelectItem>
                      <SelectItem value={EducationStatus.COMPLETED}>
                        Completed
                      </SelectItem>
                      <SelectItem value={EducationStatus.PAUSED}>
                        Paused
                      </SelectItem>
                      <SelectItem value={EducationStatus.TRANSFERRED}>
                        Transferred
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="currently-enrolled"
                    checked={educationForm.isCurrently}
                    onCheckedChange={(checked) =>
                      setEducationForm((prev) => ({
                        ...prev,
                        isCurrently: checked,
                      }))
                    }
                  />
                  <Label htmlFor="currently-enrolled">Currently enrolled</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEducationForm(false);
                      setEditingEducationId(null);
                      setSelectedUniversity(null);
                      setSearchUniversity("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={
                      editingEducationId
                        ? updateStudentEducationRecord
                        : addStudentEducationHandler
                    }
                    disabled={saving || !educationForm.universityId}
                  >
                    {saving
                      ? "Saving..."
                      : editingEducationId
                        ? "Update"
                        : "Add"}{" "}
                    Education
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
              <CardDescription>
                Add your technical and soft skills to showcase your abilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Skill */}
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill (e.g., JavaScript, Project Management)"
                    onKeyPress={(e) => e.key === "Enter" && addSkillHandler()}
                  />
                  <Button onClick={addSkillHandler} disabled={!newSkill.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              )}

              {/* Skills List */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant="secondary"
                      className="text-sm py-1 px-3 flex items-center gap-2"
                    >
                      <Code className="w-3 h-3" />
                      {skill.name}
                      {skill.endorsements > 0 && (
                        <span className="text-xs">({skill.endorsements})</span>
                      )}
                      {isEditing && (
                        <button
                          onClick={() => removeSkillHandler(skill.id)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {profile.skills.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No skills added yet</p>
                      <p className="text-sm">
                        Add your skills to showcase your expertise
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Resume Upload */}
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Resume</h4>
                    <p className="text-sm text-muted-foreground">
                      Upload your resume to apply for jobs quickly
                    </p>
                  </div>
                  {profile.resume && (
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>

                {isEditing && (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drop your resume here or click to browse
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                )}

                {profile.resume && !isEditing && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <FileText className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Resume.pdf</p>
                      <p className="text-sm text-muted-foreground">
                        Uploaded on {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can see your profile and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      Public Profile
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow employers and other users to find your profile
                    </p>
                  </div>
                  <Switch
                    checked={profile.isPublic}
                    onCheckedChange={(checked) =>
                      setProfile((prev) =>
                        prev ? { ...prev, isPublic: checked } : prev
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      Profile Visibility
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Choose who can see your detailed profile information
                    </p>
                  </div>
                  <Select
                    value={profile.visibility}
                    onValueChange={(value: "PUBLIC" | "PRIVATE") =>
                      setProfile((prev) =>
                        prev ? { ...prev, visibility: value } : prev
                      )
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          Public
                        </div>
                      </SelectItem>
                      <SelectItem value="PRIVATE">
                        <div className="flex items-center gap-2">
                          <EyeOff className="w-4 h-4" />
                          Private
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">What this means:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      • <strong>Public:</strong> Your profile can be found by
                      employers and appears in search results
                    </li>
                    <li>
                      • <strong>Private:</strong> Only you can see your full
                      profile details
                    </li>
                    <li>
                      • Your name and university will always be visible to
                      employers when you apply for jobs
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

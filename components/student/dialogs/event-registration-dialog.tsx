"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Utensils,
  Accessibility,
  Target,
  Users,
  Building,
  Code,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { Event, RegisterForEventData } from "@/lib/api";
import { format } from "date-fns";

const registrationSchema = z.object({
  dietaryRestrictions: z.string().optional(),
  accessibilityNeeds: z.string().optional(),
  emergencyContact: z.string().optional(),
  tshirtSize: z.enum(["XS", "S", "M", "L", "XL", "XXL"]).optional(),
  interests: z.array(z.string()).optional(),
  goals: z.string().optional(),
  lookingFor: z.array(z.string()).optional(),
  industries: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  experience: z.string().optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface EventRegistrationDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: (data: RegisterForEventData) => void;
  isLoading?: boolean;
}

export function EventRegistrationDialog({
  event,
  open,
  onOpenChange,
  onRegister,
  isLoading = false,
}: EventRegistrationDialogProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedLookingFor, setSelectedLookingFor] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      interests: [],
      lookingFor: [],
      industries: [],
      skills: [],
    },
  });

  const isEventFull = event.currentAttendees >= event.capacity;
  const registrationFee = event.registrationFee || 0;

  // Interest options
  const interestOptions = [
    "Networking",
    "Learning",
    "Job Opportunities",
    "Skill Development",
    "Industry Insights",
    "Career Guidance",
    "Technology Trends",
    "Leadership",
    "Entrepreneurship",
    "Innovation",
    "Research",
    "Mentorship",
  ];

  // Looking for options
  const lookingForOptions = [
    "Full-time Job",
    "Internship",
    "Co-op",
    "Part-time Work",
    "Freelance Opportunities",
    "Mentorship",
    "Networking",
    "Learning",
    "Career Change",
    "Skill Development",
    "Industry Contacts",
    "Partnerships",
  ];

  // Industry options
  const industryOptions = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Consulting",
    "Marketing",
    "Sales",
    "Engineering",
    "Design",
    "Research",
    "Government",
    "Non-profit",
    "Retail",
    "Manufacturing",
    "Media",
    "Real Estate",
    "Transportation",
    "Energy",
    "Agriculture",
    "Other",
  ];

  // Skills options
  const skillOptions = [
    "JavaScript",
    "Python",
    "Java",
    "React",
    "Node.js",
    "SQL",
    "Data Analysis",
    "Machine Learning",
    "Project Management",
    "Leadership",
    "Communication",
    "Problem Solving",
    "Teamwork",
    "Public Speaking",
    "Marketing",
    "Sales",
    "Design",
    "Writing",
    "Research",
    "Analytics",
  ];

  const handleMultiSelect = (
    value: string,
    selectedValues: string[],
    setSelectedValues: (values: string[]) => void,
    fieldName: keyof RegistrationFormData
  ) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    setSelectedValues(newValues);
    setValue(fieldName, newValues as any);
  };

  const onSubmit = (data: RegistrationFormData) => {
    const registrationData: RegisterForEventData = {
      ...data,
      interests: selectedInterests,
      lookingFor: selectedLookingFor,
      industries: selectedIndustries,
      skills: selectedSkills,
    };

    onRegister(registrationData);
  };

  const handleClose = () => {
    reset();
    setSelectedInterests([]);
    setSelectedLookingFor([]);
    setSelectedIndustries([]);
    setSelectedSkills([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Register for Event</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {format(new Date(event.startDate), "EEEE, MMMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {event.currentAttendees} / {event.capacity} registered
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {registrationFee === 0
                      ? "Free Event"
                      : `$${registrationFee} Registration Fee`}
                  </span>
                </div>
              </div>

              {isEventFull && (
                <div className="flex items-center gap-2 mt-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    This event is at capacity. You will be added to the
                    waitlist.
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Registration Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      placeholder="Name and phone number"
                      {...register("emergencyContact")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tshirtSize">
                      T-Shirt Size (if applicable)
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("tshirtSize", value as any)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="XS">XS</SelectItem>
                        <SelectItem value="S">S</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="XL">XL</SelectItem>
                        <SelectItem value="XXL">XXL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietaryRestrictions">
                    <Utensils className="w-4 h-4 inline mr-2" />
                    Dietary Restrictions or Allergies
                  </Label>
                  <Textarea
                    id="dietaryRestrictions"
                    placeholder="Please list any dietary restrictions, allergies, or special meal requirements..."
                    {...register("dietaryRestrictions")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accessibilityNeeds">
                    <Accessibility className="w-4 h-4 inline mr-2" />
                    Accessibility Requirements
                  </Label>
                  <Textarea
                    id="accessibilityNeeds"
                    placeholder="Please describe any accessibility accommodations you need..."
                    {...register("accessibilityNeeds")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Goals and Interests */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Your Goals & Interests
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Help us understand what you're looking to get out of this
                  event
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goals">
                    <Target className="w-4 h-4 inline mr-2" />
                    What are your main goals for attending this event?
                  </Label>
                  <Textarea
                    id="goals"
                    placeholder="Describe what you hope to achieve by attending this event..."
                    {...register("goals")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Areas of Interest</Label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((interest) => (
                      <Badge
                        key={interest}
                        variant={
                          selectedInterests.includes(interest)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() =>
                          handleMultiSelect(
                            interest,
                            selectedInterests,
                            setSelectedInterests,
                            "interests"
                          )
                        }
                      >
                        {interest}
                        {selectedInterests.includes(interest) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>What are you looking for?</Label>
                  <div className="flex flex-wrap gap-2">
                    {lookingForOptions.map((option) => (
                      <Badge
                        key={option}
                        variant={
                          selectedLookingFor.includes(option)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() =>
                          handleMultiSelect(
                            option,
                            selectedLookingFor,
                            setSelectedLookingFor,
                            "lookingFor"
                          )
                        }
                      >
                        {option}
                        {selectedLookingFor.includes(option) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Background */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Professional Background
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  This helps organizers and other attendees connect with you
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Industries of Interest</Label>
                  <div className="flex flex-wrap gap-2">
                    {industryOptions.map((industry) => (
                      <Badge
                        key={industry}
                        variant={
                          selectedIndustries.includes(industry)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() =>
                          handleMultiSelect(
                            industry,
                            selectedIndustries,
                            setSelectedIndustries,
                            "industries"
                          )
                        }
                      >
                        {industry}
                        {selectedIndustries.includes(industry) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    <Code className="w-4 h-4 inline mr-2" />
                    Skills & Technologies
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {skillOptions.map((skill) => (
                      <Badge
                        key={skill}
                        variant={
                          selectedSkills.includes(skill) ? "default" : "outline"
                        }
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() =>
                          handleMultiSelect(
                            skill,
                            selectedSkills,
                            setSelectedSkills,
                            "skills"
                          )
                        }
                      >
                        {skill}
                        {selectedSkills.includes(skill) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">
                    Experience Level & Background
                  </Label>
                  <Textarea
                    id="experience"
                    placeholder="Briefly describe your experience level, current role, or academic background..."
                    {...register("experience")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Registration Fee */}
            {registrationFee > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Registration Fee</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Total Amount</p>
                      <p className="text-sm text-muted-foreground">
                        Registration fee for {event.title}
                      </p>
                    </div>
                    <div className="text-2xl font-bold">${registrationFee}</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Payment will be processed after registration confirmation.
                  </p>
                </CardContent>
              </Card>
            )}
          </form>
        </div>

        <DialogFooter className="flex items-center gap-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading
              ? "Registering..."
              : isEventFull
                ? "Join Waitlist"
                : "Register Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

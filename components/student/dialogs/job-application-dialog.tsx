"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
// import { useToast } from "@/hooks/use-toast"
import { toast } from "sonner";
import {
  FileText,
  Upload,
  X,
  Briefcase,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  industry: string;
  experience: string;
  match?: number;
}

interface JobApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobListing | null;
  onSubmit: (jobId: string, applicationData: ApplicationData) => Promise<void>;
}

interface ApplicationData {
  resumeUrl?: string;
  coverLetter: string;
  additionalDocuments?: string[];
  answers?: Record<string, string>;
}

export function JobApplicationDialog({
  open,
  onOpenChange,
  job,
  onSubmit,
}: JobApplicationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    coverLetter: "",
    additionalDocuments: [],
    answers: {},
  });
  const [selectedResume, setSelectedResume] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  // const { toast } = useToast();

  // Sample screening questions (would come from job posting)
  const screeningQuestions = [
    {
      id: "experience",
      question: "How many years of relevant experience do you have?",
      type: "select",
      options: ["0-1 years", "1-3 years", "3-5 years", "5+ years"],
      required: true,
    },
    {
      id: "availability",
      question: "When can you start?",
      type: "select",
      options: ["Immediately", "2 weeks", "1 month", "2+ months"],
      required: true,
    },
    {
      id: "remote",
      question: "Are you comfortable working remotely?",
      type: "select",
      options: ["Yes", "No", "Hybrid preferred"],
      required: false,
    },
  ];

  // Sample user resumes (would come from user profile)
  const userResumes = [
    {
      id: "resume_1",
      name: "Software Engineer Resume - Updated.pdf",
      uploadDate: "2024-01-15",
      url: "/resumes/resume_1.pdf",
    },
    {
      id: "resume_2",
      name: "Full Stack Developer Resume.pdf",
      uploadDate: "2024-01-10",
      url: "/resumes/resume_2.pdf",
    },
  ];

  const handleSubmit = async () => {
    if (!job) return;

    // Validation
    if (!selectedResume) {
      toast.error("Please select a resume to submit with your application.");
      return;
    }

    // Check required screening questions
    const requiredQuestions = screeningQuestions.filter((q) => q.required);
    const unansweredRequired = requiredQuestions.filter(
      (q) => !applicationData.answers?.[q.id]
    );

    if (unansweredRequired.length > 0) {
      toast.error("Please answer all required screening questions.");
      return;
    }

    setLoading(true);
    try {
      const submissionData: ApplicationData = {
        ...applicationData,
        resumeUrl: selectedResume,
      };

      await onSubmit(job.id, submissionData);

      // Reset form
      setApplicationData({
        coverLetter: "",
        additionalDocuments: [],
        answers: {},
      });
      setSelectedResume("");
      setUploadedFiles([]);
      setStep(1);
      onOpenChange(false);

      toast.success("Your application has been sent successfully.");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(
        "There was an error submitting your application. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (match >= 80) return "text-blue-600 bg-blue-50 border-blue-200";
    if (match >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Apply for Position
          </DialogTitle>
          <DialogDescription>
            Complete your application for this position. Make sure to provide
            all required information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center text-primary font-semibold">
                  {job.company.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <p className="text-muted-foreground flex items-center gap-1 mb-2">
                        <Building2 className="w-4 h-4" />
                        {job.company} • {job.industry}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </span>
                      </div>
                    </div>
                    {job.match && (
                      <Badge className={`${getMatchColor(job.match)} border`}>
                        {job.match}% Match
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Steps */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div
              className={`flex items-center space-x-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? "border-primary bg-primary text-white" : "border-muted-foreground"}`}
              >
                {step > 1 ? <CheckCircle className="w-4 h-4" /> : "1"}
              </div>
              <span className="text-sm font-medium">Resume & Documents</span>
            </div>
            <div className="w-12 h-px bg-border"></div>
            <div
              className={`flex items-center space-x-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? "border-primary bg-primary text-white" : "border-muted-foreground"}`}
              >
                {step > 2 ? <CheckCircle className="w-4 h-4" /> : "2"}
              </div>
              <span className="text-sm font-medium">Cover Letter</span>
            </div>
            <div className="w-12 h-px bg-border"></div>
            <div
              className={`flex items-center space-x-2 ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? "border-primary bg-primary text-white" : "border-muted-foreground"}`}
              >
                3
              </div>
              <span className="text-sm font-medium">Screening Questions</span>
            </div>
          </div>

          {/* Step 1: Resume & Documents */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Select Resume *</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose the resume that best matches this position
                </p>
                <div className="space-y-3">
                  {userResumes.map((resume) => (
                    <div
                      key={resume.id}
                      className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedResume === resume.url
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedResume(resume.url)}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedResume === resume.url
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        }`}
                      >
                        {selectedResume === resume.url && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">{resume.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Updated {resume.uploadDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">
                  Additional Documents (Optional)
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload portfolio, certificates, or other relevant documents
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, DOC, DOCX (MAX. 10MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {file.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Cover Letter */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="coverLetter" className="text-base font-medium">
                  Cover Letter *
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Explain why you're interested in this position and how your
                  experience aligns with the requirements
                </p>
                <Textarea
                  id="coverLetter"
                  placeholder="Dear Hiring Manager,

I am writing to express my strong interest in the [Position Title] role at [Company Name]. With my background in [relevant experience], I am excited about the opportunity to contribute to your team.

[Highlight relevant experience and skills]

[Explain why you're interested in the company and role]

[Close with enthusiasm and next steps]

Best regards,
[Your Name]"
                  value={applicationData.coverLetter}
                  onChange={(e) =>
                    setApplicationData((prev) => ({
                      ...prev,
                      coverLetter: e.target.value,
                    }))
                  }
                  className="min-h-[300px] resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {applicationData.coverLetter.length}/2000 characters
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">
                      Tips for a great cover letter:
                    </h4>
                    <ul className="text-sm text-blue-800 mt-2 space-y-1">
                      <li>
                        • Personalize it for this specific role and company
                      </li>
                      <li>
                        • Highlight 2-3 key achievements that match the job
                        requirements
                      </li>
                      <li>
                        • Show enthusiasm for the role and company mission
                      </li>
                      <li>• Keep it concise and professional</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Screening Questions */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium mb-2">
                  Screening Questions
                </h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Please answer the following questions to help the employer
                  understand your fit for this role
                </p>

                <div className="space-y-6">
                  {screeningQuestions.map((question, index) => (
                    <div key={question.id} className="space-y-2">
                      <Label className="text-sm font-medium">
                        {index + 1}. {question.question}
                        {question.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </Label>

                      {question.type === "select" && (
                        <Select
                          value={applicationData.answers?.[question.id] || ""}
                          onValueChange={(value) =>
                            setApplicationData((prev) => ({
                              ...prev,
                              answers: {
                                ...prev.answers,
                                [question.id]: value,
                              },
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option..." />
                          </SelectTrigger>
                          <SelectContent>
                            {question.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between pt-6 border-t">
          <div className="flex items-center space-x-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !selectedResume}
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

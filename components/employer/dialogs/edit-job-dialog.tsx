"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useJobs } from "@/hooks/use-jobs";
import { toast } from "sonner";

interface EditJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: any;
  onSuccess: () => void;
}

export function EditJobDialog({
  open,
  onOpenChange,
  job,
  onSuccess,
}: EditJobDialogProps) {
  const { updateJob } = useJobs();
  const [loading, setLoading] = useState(false);
  const [editJobForm, setEditJobForm] = useState({
    title: job.title || "",
    description: job.description || "",
    requirements: job.requirements || [],
    type: job.type || "Full-time",
    location: job.location || "",
    salary: {
      min: job.salary?.min || 0,
      max: job.salary?.max || 0,
      currency: job.salary?.currency || "RWF",
      period: job.salary?.period || "monthly",
    },
    applicationDeadline: job.applicationDeadline
      ? new Date(job.applicationDeadline).toISOString().split("T")[0]
      : "",
  });

  const handleUpdateJob = async () => {
    try {
      setLoading(true);

      // Validate form
      if (
        !editJobForm.title ||
        !editJobForm.description ||
        !editJobForm.location
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      const jobData = {
        ...editJobForm,
        requirements: editJobForm.requirements.filter(
          (req) => req.trim() !== ""
        ),
        applicationDeadline: new Date(
          editJobForm.applicationDeadline
        ).toISOString(),
      };

      await updateJob(job.id, jobData);
      toast.success("Job updated successfully!");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update job");
    } finally {
      setLoading(false);
    }
  };

  const addRequirement = () => {
    setEditJobForm((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setEditJobForm((prev) => ({
      ...prev,
      requirements: prev.requirements.map((req, i) =>
        i === index ? value : req
      ),
    }));
  };

  const removeRequirement = (index: number) => {
    setEditJobForm((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job Posting</DialogTitle>
          <DialogDescription>
            Update the details for this job posting
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              value={editJobForm.title}
              onChange={(e) =>
                setEditJobForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="e.g. Senior Software Engineer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Job Type</Label>
              <Select
                value={editJobForm.type}
                onValueChange={(value) =>
                  setEditJobForm((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={editJobForm.location}
                onChange={(e) =>
                  setEditJobForm((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                placeholder="e.g. Kigali, Rwanda"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={editJobForm.description}
              onChange={(e) =>
                setEditJobForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              rows={4}
            />
          </div>

          <div>
            <Label>Requirements</Label>
            <div className="space-y-2">
              {editJobForm.requirements.map((req, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={req}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    placeholder="e.g. Bachelor's degree in Computer Science"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeRequirement(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRequirement}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Requirement
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salaryMin">Salary Range (RWF Monthly)</Label>
              <div className="flex gap-2">
                <Input
                  id="salaryMin"
                  type="number"
                  value={editJobForm.salary.min || ""}
                  onChange={(e) =>
                    setEditJobForm((prev) => ({
                      ...prev,
                      salary: {
                        ...prev.salary,
                        min: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  placeholder="Min (e.g. 500,000)"
                />
                <Input
                  type="number"
                  value={editJobForm.salary.max || ""}
                  onChange={(e) =>
                    setEditJobForm((prev) => ({
                      ...prev,
                      salary: {
                        ...prev.salary,
                        max: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  placeholder="Max (e.g. 800,000)"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Enter amounts in Rwandan Francs (RWF)
              </p>
            </div>

            <div>
              <Label htmlFor="deadline">Application Deadline *</Label>
              <Input
                id="deadline"
                type="date"
                value={editJobForm.applicationDeadline}
                onChange={(e) =>
                  setEditJobForm((prev) => ({
                    ...prev,
                    applicationDeadline: e.target.value,
                  }))
                }
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdateJob} disabled={loading}>
            {loading ? "Updating..." : "Update Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

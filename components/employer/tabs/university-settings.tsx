"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Building2,
  Mail,
  Phone,
  User,
  Calendar,
  GraduationCap,
  Briefcase,
  AlertTriangle,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import {
  UniversityPartnership,
  updatePartnership,
  deletePartnership,
} from "@/lib/api-university-partners";

interface UniversitySettingsProps {
  partnership: UniversityPartnership;
  onPartnershipDeleted: () => void;
}

export function UniversitySettings({
  partnership,
  onPartnershipDeleted,
}: UniversitySettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    description: partnership.description || "",
    contactEmail: partnership.contactEmail || "",
    contactPhone: partnership.contactPhone || "",
    contactPerson: partnership.contactPerson || "",
    hiringGoals: partnership.hiringGoals || 0,
    internshipGoals: partnership.internshipGoals || 0,
    preferredMajors: partnership.preferredMajors || [],
    benefits: partnership.benefits || [],
    requirements: partnership.requirements || [],
    notes: partnership.notes || "",
  });

  const handleInputChange = (
    field: string,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      await updatePartnership(partnership.id, formData);
      toast.success("Partnership settings updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update partnership settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePartnership = async () => {
    try {
      setIsLoading(true);
      await deletePartnership(partnership.id);
      toast.success("Partnership deleted successfully");
      onPartnershipDeleted();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete partnership");
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Partnership Settings</h2>
          <p className="text-muted-foreground">
            Manage your partnership with {partnership.universityName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSaveChanges}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Partnership
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Partnership</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this partnership? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeletePartnership}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Delete Partnership
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update the basic details of your partnership
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Partnership Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe the goals and scope of this partnership..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional notes or comments..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Update the contact details for this partnership
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) =>
                  handleInputChange("contactPerson", e.target.value)
                }
                placeholder="Name of primary contact"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) =>
                  handleInputChange("contactEmail", e.target.value)
                }
                placeholder="Contact email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) =>
                  handleInputChange("contactPhone", e.target.value)
                }
                placeholder="Contact phone number"
              />
            </div>
          </CardContent>
        </Card>

        {/* Recruitment Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Recruitment Goals</CardTitle>
            <CardDescription>
              Set your hiring and internship goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hiringGoals">Hiring Goals</Label>
              <Input
                id="hiringGoals"
                type="number"
                value={formData.hiringGoals}
                onChange={(e) =>
                  handleInputChange(
                    "hiringGoals",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Number of students to hire"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="internshipGoals">Internship Goals</Label>
              <Input
                id="internshipGoals"
                type="number"
                value={formData.internshipGoals}
                onChange={(e) =>
                  handleInputChange(
                    "internshipGoals",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Number of internships to offer"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferred Majors */}
        <Card>
          <CardHeader>
            <CardTitle>Preferred Majors</CardTitle>
            <CardDescription>
              Specify the majors you're interested in recruiting from
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preferredMajors">Add Major</Label>
              <div className="flex gap-2">
                <Input
                  id="preferredMajors"
                  placeholder="Enter a major..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value) {
                      e.preventDefault();
                      const newMajor = e.currentTarget.value;
                      handleInputChange("preferredMajors", [
                        ...formData.preferredMajors,
                        newMajor,
                      ]);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.preferredMajors.map((major, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => {
                      const updatedMajors = formData.preferredMajors.filter(
                        (_, i) => i !== index
                      );
                      handleInputChange("preferredMajors", updatedMajors);
                    }}
                  >
                    {major}
                    <span className="ml-1">×</span>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partnership Status */}
      <Card>
        <CardHeader>
          <CardTitle>Partnership Status</CardTitle>
          <CardDescription>
            Current status: <Badge>{partnership.status}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Partnership started on{" "}
            {partnership.startDate
              ? new Date(partnership.startDate).toLocaleDateString()
              : "N/A"}
            {partnership.endDate &&
              ` and ends on ${new Date(partnership.endDate).toLocaleDateString()}`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

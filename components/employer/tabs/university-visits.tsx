"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Edit,
  Trash2,
  Building,
  CheckCircle,
  AlertTriangle,
  Loader2,
  FileText,
  MessageSquare,
} from "lucide-react";
import {
  UniversityPartnership,
  UniversityVisit,
  createVisit,
  getPartnershipVisits,
  updateVisit,
  deleteVisit,
} from "@/lib/api-university-partners";

interface UniversityVisitsProps {
  partnership: UniversityPartnership;
}

export function UniversityVisits({ partnership }: UniversityVisitsProps) {
  const [visits, setVisits] = useState<UniversityVisit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewVisitDialog, setShowNewVisitDialog] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<UniversityVisit | null>(
    null
  );

  // Form states
  const [newVisitData, setNewVisitData] = useState({
    purpose: "",
    visitDate: "",
    duration: 60,
    location: "",
    attendees: [] as string[],
    agenda: "",
    notes: "",
  });

  useEffect(() => {
    loadVisits();
  }, [partnership.id]);

  const loadVisits = async () => {
    try {
      setIsLoading(true);
      const result = await getPartnershipVisits(partnership.id);
      setVisits(result);
    } catch (error) {
      toast.error("Failed to load visits");
      console.error("Error loading visits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVisit = async () => {
    try {
      setIsLoading(true);
      const visit = await createVisit(partnership.id, newVisitData);
      setVisits((prev) => [visit, ...prev]);
      setShowNewVisitDialog(false);
      setNewVisitData({
        purpose: "",
        visitDate: "",
        duration: 60,
        location: "",
        attendees: [],
        agenda: "",
        notes: "",
      });
      toast.success("Visit scheduled successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to schedule visit");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVisit = async (visitId: string) => {
    try {
      await deleteVisit(visitId);
      setVisits((prev) => prev.filter((v) => v.id !== visitId));
      toast.success("Visit deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete visit");
    }
  };

  const getVisitStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      case "COMPLETED":
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "CANCELLED":
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
      case "RESCHEDULED":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  const getVisitStatusIcon = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return <Clock className="w-3 h-3" />;
      case "COMPLETED":
        return <CheckCircle className="w-3 h-3" />;
      case "CANCELLED":
        return <AlertTriangle className="w-3 h-3" />;
      case "RESCHEDULED":
        return <Calendar className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Campus Visits</h2>
          <p className="text-muted-foreground">
            Schedule and manage visits to {partnership.university?.name}
          </p>
        </div>
        <Dialog open={showNewVisitDialog} onOpenChange={setShowNewVisitDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Visit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule Campus Visit</DialogTitle>
              <DialogDescription>
                Plan a visit to {partnership.university?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">{/* Add form fields here */}</div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Visits List */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : visits.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Visits Scheduled</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Schedule your first campus visit to {partnership.university?.name}
            </p>
            <Button onClick={() => setShowNewVisitDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Your First Visit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {visits.map((visit) => (
            <Card key={visit.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <div
                    className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                      visit.status === "SCHEDULED"
                        ? "bg-blue-100 text-blue-600"
                        : visit.status === "COMPLETED"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Building className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          {visit.purpose}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {visit.notes || "No additional notes"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteVisit(visit.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(visit.visitDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{visit.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{visit.location || "TBD"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getVisitStatusColor(
                            visit.status
                          )}`}
                        >
                          {getVisitStatusIcon(visit.status)}
                          {visit.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Attendees ({visit.attendees.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {visit.attendees.map((attendee, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-muted rounded-full text-xs"
                            >
                              {attendee}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Resources
                        </h4>
                        <div className="flex gap-2">
                          {visit.agenda && (
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4 mr-2" />
                              View Agenda
                            </Button>
                          )}
                          {/* Removed feedback button since property doesn't exist */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

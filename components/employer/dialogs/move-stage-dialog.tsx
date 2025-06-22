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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  Clock,
  Users,
  Calendar,
  Trophy,
  ArrowRight,
  User,
} from "lucide-react";
import { toast } from "sonner";

interface MoveStageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: any;
  onSuccess: () => void;
  onMoveStage: (
    applicationId: string,
    newStatus: string,
    message?: string
  ) => Promise<void>;
}

const APPLICATION_STAGES = [
  {
    id: "PENDING",
    label: "Pending Review",
    description: "Application received and waiting for initial review",
    icon: Clock,
    color: "bg-orange-100 text-orange-700 border-orange-200",
    order: 1,
  },
  {
    id: "REVIEWED",
    label: "Under Review",
    description: "Application is being evaluated by the hiring team",
    icon: Users,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    order: 2,
  },
  {
    id: "SHORTLISTED",
    label: "Shortlisted",
    description: "Candidate has been shortlisted for further consideration",
    icon: CheckCircle,
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    order: 3,
  },
  {
    id: "INTERVIEWED",
    label: "Interviewed",
    description: "Candidate has completed the interview process",
    icon: Calendar,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    order: 4,
  },
  {
    id: "ACCEPTED",
    label: "Accepted",
    description: "Offer has been extended and accepted",
    icon: Trophy,
    color: "bg-green-100 text-green-700 border-green-200",
    order: 5,
  },
];

export function MoveStageDialog({
  open,
  onOpenChange,
  application,
  onSuccess,
  onMoveStage,
}: MoveStageDialogProps) {
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const currentStage = APPLICATION_STAGES.find(
    (stage) => stage.id === application?.status
  );

  const availableStages = APPLICATION_STAGES.filter(
    (stage) => stage.id !== application?.status && stage.id !== "REJECTED"
  );

  const handleMoveStage = async () => {
    if (!selectedStage) {
      toast.error("Please select a stage to move to");
      return;
    }

    try {
      setLoading(true);
      await onMoveStage(application.id, selectedStage, message || undefined);

      const selectedStageInfo = APPLICATION_STAGES.find(
        (s) => s.id === selectedStage
      );
      toast.success(`Moved to ${selectedStageInfo?.label} successfully!`);

      onSuccess();
      onOpenChange(false);
      setSelectedStage("");
      setMessage("");
    } catch (error: any) {
      toast.error(error.message || "Failed to move stage");
    } finally {
      setLoading(false);
    }
  };

  const getStageIcon = (stage: any) => {
    const Icon = stage.icon;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-blue-600" />
            Move Application Stage
          </DialogTitle>
          <DialogDescription>
            Select the stage you want to move{" "}
            <span className="font-medium">
              {application?.user?.firstName} {application?.user?.lastName}
            </span>{" "}
            to for this application.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Stage */}
          {currentStage && (
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Current Stage</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={currentStage.color}>
                  {getStageIcon(currentStage)}
                  <span className="ml-2">{currentStage.label}</span>
                </Badge>
                <span className="text-sm text-gray-600">
                  {currentStage.description}
                </span>
              </div>
            </div>
          )}

          {/* Available Stages */}
          <div>
            <Label className="text-base font-medium mb-4 block">
              Select New Stage
            </Label>
            <div className="grid gap-3">
              {availableStages.map((stage) => (
                <div
                  key={stage.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedStage === stage.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedStage(stage.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={stage.color}>
                        {getStageIcon(stage)}
                        <span className="ml-2">{stage.label}</span>
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          {stage.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedStage === stage.id && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Message */}
          <div>
            <Label htmlFor="message" className="text-base font-medium">
              Message (Optional)
            </Label>
            <p className="text-sm text-gray-600 mb-2">
              Add a note about this stage change that will be included in the
              notification
            </p>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g., Great interview performance, moving to final round..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Stage Progression Visual */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-3">
              Stage Progression
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              {APPLICATION_STAGES.filter((s) => s.id !== "REJECTED").map(
                (stage, index) => (
                  <div key={stage.id} className="flex items-center gap-2">
                    <Badge
                      className={`${
                        stage.id === application?.status
                          ? "bg-blue-600 text-white"
                          : stage.id === selectedStage
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {stage.label}
                    </Badge>
                    {index < APPLICATION_STAGES.length - 2 && (
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                )
              )}
            </div>
            <p className="text-xs text-blue-700 mt-2">
              Current position highlighted in blue, selected new stage in green
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleMoveStage}
            disabled={!selectedStage || loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Moving..." : "Move to Selected Stage"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

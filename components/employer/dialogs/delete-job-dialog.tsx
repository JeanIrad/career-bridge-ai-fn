"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface DeleteJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
  onConfirm: () => void;
  loading?: boolean;
}

export function DeleteJobDialog({
  open,
  onOpenChange,
  jobTitle,
  onConfirm,
  loading = false,
}: DeleteJobDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Confirm Delete Job
          </DialogTitle>
          <DialogDescription className="pt-4">
            Are you sure you want to delete the job posting for{" "}
            <span className="font-medium text-foreground">{jobTitle}</span>?
            <div className="mt-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              This action cannot be undone. This will permanently delete the job
              posting and remove all associated applications and data.
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting..." : "Delete Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

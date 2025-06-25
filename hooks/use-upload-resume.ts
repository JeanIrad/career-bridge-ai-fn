import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/axios";

export const useUploadResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/upload/resume", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error: any) {
        console.error("Error uploading resume:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users", "current"] });
      queryClient.invalidateQueries({ queryKey: ["users", "documents"] });
      toast.success("Resume uploaded successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to upload resume";
      toast.error(message);
    },
  });
};

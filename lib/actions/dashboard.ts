import { useQuery } from "@tanstack/react-query";
import api from "../axios";
import { toast } from "sonner";
import { toastErrorStyles } from "../utils";

export const useGetDashboardData = () => {
  return useQuery({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      try {
        const response = await api.get("/dashboard");
        return response.data;
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        throw error;
      }
    },
  });
};

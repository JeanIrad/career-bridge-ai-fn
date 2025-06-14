"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole } from "../utils/types/user";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: "1",
    name: "John Doe",
    email: "john.doe@university.edu",
    role: "STUDENT",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    profile: {
      university: "University of Technology",
      major: "Computer Science",
      graduationYear: "2024",
    },
  });

  const switchRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };

      // Update profile based on role
      switch (role) {
        case "STUDENT":
          updatedUser.name = "John Doe";
          updatedUser.email = "john.doe@university.edu";
          updatedUser.profile = {
            university: "University of Technology",
            major: "Computer Science",
            graduationYear: "2024",
          };
          break;
        case "ADMIN":
          updatedUser.name = "Dr. Sarah Wilson";
          updatedUser.email = "sarah.wilson@university.edu";
          updatedUser.profile = {
            university: "University of Technology",
            department: "Career Services",
            position: "Director of Career Services",
          };
          break;
        case "EMPLOYER":
          updatedUser.name = "Michael Chen";
          updatedUser.email = "michael.chen@techcorp.com";
          updatedUser.profile = {
            company: "TechCorp Inc.",
            position: "Senior Recruiter",
            department: "Human Resources",
          };
          break;
        case "PROFESSOR":
          updatedUser.name = "Emily Rodriguez";
          updatedUser.email = "emily.rodriguez@university.edu";
          updatedUser.profile = {
            university: "University of Technology",
            department: "Student Affairs",
            position: "Career Counselor",
          };
          break;
      }

      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

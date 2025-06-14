export type UserRole =
  | "STUDENT"
  | "ADMIN"
  | "EMPLOYER"
  | "EMPLOYER"
  | "PROFESSOR"
  | "ALUMNI"
  | "OTHER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  profile?: {
    university?: string;
    major?: string;
    graduationYear?: string;
    company?: string;
    position?: string;
    department?: string;
  };
}

export interface DashboardConfig {
  navigation: NavigationItem[];
  features: string[];
  permissions: string[];
}

export interface NavigationItem {
  name: string;
  id: string;
  icon: any;
  roles: ("student" | "admin" | "employer" | "staff")[];
}

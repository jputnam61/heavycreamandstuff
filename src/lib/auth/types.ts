export interface UserProfile {
  id: string;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface AuthError {
  message: string;
  status?: number;
}
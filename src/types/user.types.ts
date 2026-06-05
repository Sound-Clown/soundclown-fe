export type Role = "LISTENER" | "ARTIST" | "ADMIN";

export type User = {
  id: number;
  username: string;
  email: string;
  role: Role;
};

// Profile công khai (GET /api/users/{id}) — có thêm active, createdAt
export type UserProfile = User & {
  active: boolean;
  createdAt: string;
};

// Auth response (register/login)
export type AuthResponse = {
  accessToken: string;
  user: User;
};

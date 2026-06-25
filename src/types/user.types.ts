export type Role = "LISTENER" | "ARTIST" | "ADMIN";

export type User = {
  id: number;
  username: string;
  email: string;
  role: Role;
};

// Profile công khai (GET /api/users/{id}) — có thêm active, createdAt, premium
export type UserProfile = User & {
  active: boolean;
  createdAt: string;
  premium: boolean; // còn hạn Premium hay không
  premiumUntil: string | null; // ngày hết hạn, null = chưa từng mua
};

// Auth response (register/login)
export type AuthResponse = {
  accessToken: string;
  user: User;
};

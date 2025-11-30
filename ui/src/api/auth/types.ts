export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
}

export interface LoginResponse {
  user: UserResponse;
}

export interface RegisterResponse {
  success: boolean;
}

export interface LogoutResponse {
  success: boolean;
}

export interface WhoAmIResponse {
  user: UserResponse | null;
}

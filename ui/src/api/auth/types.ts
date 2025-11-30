export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  success: boolean;
}

export interface LogoutResponse {
  success: boolean;
}

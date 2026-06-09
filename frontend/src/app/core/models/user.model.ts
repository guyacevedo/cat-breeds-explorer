/** Pure domain types for authentication (Model layer). */

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/** Immutable typed error matching the backend contract. */
export interface ApiError {
  error: string;
  code: string;
  timestamp: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  roles: UserRole[];
  twoFactorEnabled: boolean;
  lastLogin?: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  twoFactorRequired: boolean;
  sessionTimeout: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
  twoFactorCode?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenPayload {
  userId: string;
  username: string;
  roles: UserRole[];
  exp: number;
  iat: number;
}

export type AuthenticationResult = {
  success: boolean;
  message?: string;
  data?: AuthResponse;
  error?: Error;
}
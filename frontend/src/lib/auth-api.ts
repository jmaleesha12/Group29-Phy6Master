export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export type AuthResponse = {
  userId: number;
  username: string;
  name: string;
  role: UserRole;
  message: string;
};

export type PasswordResetResponse = {
  message: string;
  token?: string;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

async function request<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data as T;
}

export function signIn(username: string, password: string) {
  return request<AuthResponse>("/api/auth/signin", { username, password });
}

export function signUp(name: string, username: string, password: string) {
  return request<AuthResponse>("/api/auth/signup", {
    name,
    username,
    password,
  });
}

export function requestPasswordReset(email: string) {
  return request<PasswordResetResponse>("/api/auth/password-reset/request", { email });
}

export function confirmPasswordReset(token: string, newPassword: string) {
  return request<PasswordResetResponse>("/api/auth/password-reset/confirm", { 
    token, 
    newPassword 
  });
}

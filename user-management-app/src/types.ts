
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Hashed password from backend
}

export interface UserRequestDTO {
  name: string;
  email: string;
  password?: string; // Password is optional on update
}

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiError {
  message: string;
  details?: string[];
}

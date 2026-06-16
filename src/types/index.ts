// src/types/index.ts
// Add global interfaces and types here

export interface User {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
}

export interface ApiResponse<T> {
  status: boolean;
  message?: string;
  data?: T;
}

// Response payload returned after successful authentication
export interface AuthResponse {
  access_token: string
  refresh_token: string
  user_id: string
  email: string
}

// Minimal user identity fields
export interface UserInfo {
  id: string
  email: string
}

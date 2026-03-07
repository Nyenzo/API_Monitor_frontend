import { supabase } from './supabase'

const API_BASE = import.meta.env.VITE_API_BASE_URL as string

// Build request headers with the current session's access token
async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) return { 'Content-Type': 'application/json' }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

// Parse the response body and throw on non-OK status codes
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(body.detail || `HTTP ${response.status}`)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

// Typed HTTP client wrapping fetch with automatic auth headers
export const api = {
  // Send a GET request to the backend API
  async get<T>(path: string): Promise<T> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}${path}`, { headers })
    return handleResponse<T>(response)
  },

  // Send a POST request with an optional JSON body
  async post<T>(path: string, body?: unknown): Promise<T> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
    return handleResponse<T>(response)
  },

  // Send a PATCH request with a JSON body for partial updates
  async patch<T>(path: string, body: unknown): Promise<T> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    })
    return handleResponse<T>(response)
  },

  // Send a DELETE request to remove a resource
  async del<T>(path: string): Promise<T> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'DELETE',
      headers,
    })
    return handleResponse<T>(response)
  },
}

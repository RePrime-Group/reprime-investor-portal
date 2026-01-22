import { supabase } from './supabase'

const TOKEN_KEY = 'reprime_auth_token'
const USER_KEY = 'reprime_auth_user'

export async function login(email, password) {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ email, password }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Login failed')
  }

  // Store token and user in localStorage
  localStorage.setItem(TOKEN_KEY, data.token)
  localStorage.setItem(USER_KEY, JSON.stringify(data.user))

  return data
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  const userStr = localStorage.getItem(USER_KEY)
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function isAuthenticated() {
  const token = getToken()
  if (!token) return false

  // Check if token is expired by decoding JWT payload
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const now = Math.floor(Date.now() / 1000)
    return payload.exp > now
  } catch {
    return false
  }
}

export function isAdmin() {
  const user = getUser()
  return user?.is_admin === true
}

// Admin API helpers
async function adminFetch(endpoint, options = {}) {
  const token = getToken()
  if (!token) throw new Error('Not authenticated')

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${endpoint}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'X-Auth-Token': token,
        ...options.headers,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }

  return data
}

export async function listUsers() {
  return adminFetch('admin-list-users')
}

export async function createUser(userData) {
  return adminFetch('admin-create-user', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export async function updateUser(userData) {
  return adminFetch('admin-update-user', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export async function deleteUser(id) {
  return adminFetch('admin-delete-user', {
    method: 'POST',
    body: JSON.stringify({ id }),
  })
}

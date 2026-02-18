const API_BASE = '/api'

const apiRequest = async (path, options = {}) => {
  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    })
  } catch {
    throw new Error('API server is not reachable. Start it with: npm run server')
  }

  let data = {}
  try {
    data = await response.json()
  } catch {
    data = {}
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`)
  }

  return data
}

export const getApiHealth = () => apiRequest('/health', { method: 'GET' })

export const getAdminSession = () => apiRequest('/auth/admin/session', { method: 'GET' })

export const adminLogin = ({ signupKey, password }) =>
  apiRequest('/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify({ signupKey, password }),
  })

export const adminLogout = () =>
  apiRequest('/auth/admin/logout', {
    method: 'POST',
  })

export const getDoctors = () => apiRequest('/admin/doctors', { method: 'GET' })

export const createDoctor = (doctor) =>
  apiRequest('/admin/doctors', {
    method: 'POST',
    body: JSON.stringify(doctor),
  })

export const updateDoctor = (registrationId, doctor) =>
  apiRequest(`/admin/doctors/${encodeURIComponent(registrationId)}`, {
    method: 'PUT',
    body: JSON.stringify(doctor),
  })

export const deleteDoctor = (registrationId) =>
  apiRequest(`/admin/doctors/${encodeURIComponent(registrationId)}`, {
    method: 'DELETE',
  })

export const requestRmpOtp = ({ registrationId, email }) =>
  apiRequest('/rmp/request-otp', {
    method: 'POST',
    body: JSON.stringify({ registrationId, email }),
  })

export const verifyRmpOtp = ({ registrationId, email, otp }) =>
  apiRequest('/rmp/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ registrationId, email, otp }),
  })

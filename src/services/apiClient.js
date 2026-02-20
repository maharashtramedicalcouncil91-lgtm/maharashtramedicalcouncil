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
    throw new Error(`API request failed for ${API_BASE}${path}. Server is not reachable.`)
  }

  let data = {}
  let rawText = ''
  try {
    rawText = await response.text()
    data = rawText ? JSON.parse(rawText) : {}
  } catch {
    data = {}
  }

  if (!response.ok) {
    const plain = String(rawText || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    throw new Error(data.message || plain || `Request failed (${response.status})`)
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

export const checkRenewalEligibility = ({ registrationId, email }) =>
  apiRequest('/rmp/renewal/eligibility', {
    method: 'POST',
    body: JSON.stringify({ registrationId, email }),
  })

export const confirmRenewalPayment = ({ registrationId, email, feeType, utrNo }) =>
  apiRequest('/rmp/renewal/confirm', {
    method: 'POST',
    body: JSON.stringify({ registrationId, email, feeType, utrNo }),
  })

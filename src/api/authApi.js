import { apiFetch } from './client'

export function login(studentNumber, password) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      studentNumber,
      password,
    }),
  })
}

export function sendEmailVerification(studentNumber) {
  return apiFetch('/api/auth/email/send', {
    method: 'POST',
    body: JSON.stringify({
      studentNumber,
    }),
  })
}

export function verifyEmailCode(studentNumber, code) {
  return apiFetch('/api/auth/email/verify', {
    method: 'POST',
    body: JSON.stringify({
      studentNumber,
      code,
    }),
  })
}

export function signup(studentNumber, password, name) {
  return apiFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      studentNumber,
      password,
      name,
    }),
  })
}

export function sendPasswordResetCode(studentNumber) {
  return apiFetch('/api/auth/password/reset/send', {
    method: 'POST',
    body: JSON.stringify({
      studentNumber,
    }),
  })
}

export function resetPassword(
  studentNumber,
  code,
  newPassword
) {
  return apiFetch('/api/auth/password/reset/confirm', {
    method: 'POST',
    body: JSON.stringify({
      studentNumber,
      code,
      newPassword,
    }),
  })
}

export function changePassword(
  currentPassword,
  newPassword
) {
  return apiFetch('/api/users/me/password', {
    method: 'PATCH',
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  })
}

export function getCurrentUser() {
  return apiFetch('/api/users/me')
} 


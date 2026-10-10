import { apiFetch } from './client'

// 내 정보
export function getMyInfo() {
  return apiFetch('/api/users/me')
}

// 비밀번호 변경
export function changeMyPassword(currentPassword, newPassword) {
  return apiFetch('/api/users/me/password', {
    method: 'PATCH',
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  })
}

// 현재 마일리지
export function getMyMileage() {
  return apiFetch('/api/mileage')
}

// 마일리지 내역
export function getMyMileageTransactions() {
  return apiFetch('/api/mileage/transactions')
}

// 내 주문 내역
export function getMyOrders() {
  return apiFetch('/api/orders/me')
}

// 로그아웃
export function logout() {
  return apiFetch('/api/auth/logout', {
    method: 'POST',
  })
}
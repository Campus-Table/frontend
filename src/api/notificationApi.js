import { apiFetch } from './client'

// ========================================
// 알림 목록 조회
//
// 기본: 최신 알림 30개
// ========================================
export function getNotifications({
  unreadOnly = false,
  limit = 30,
} = {}) {
  const params =
    new URLSearchParams()

  if (unreadOnly) {
    params.set(
      'unreadOnly',
      'true'
    )
  }

  params.set(
    'limit',
    String(limit)
  )

  return apiFetch(
    `/api/notifications?${params.toString()}`
  )
}

// ========================================
// 읽지 않은 알림 개수
//
// 나중에 StudentHome 알림 점에서 사용
// ========================================
export function getUnreadNotificationCount() {
  return apiFetch(
    '/api/notifications/unread-count'
  )
}

// ========================================
// 모든 알림 읽음 처리
// ========================================
export function markAllNotificationsRead() {
  return apiFetch(
    '/api/notifications/read-all',
    {
      method: 'PATCH',
    }
  )
}

// ========================================
// 특정 알림 하나 읽음 처리
// ========================================
export function markNotificationRead(
  notificationId
) {
  return apiFetch(
    `/api/notifications/${notificationId}/read`,
    {
      method: 'PATCH',
    }
  )
}
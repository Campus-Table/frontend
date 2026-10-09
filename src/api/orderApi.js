// src/api/orderApi.js

import { apiFetch } from './client'

// 현장 도착 인증
export function verifyArrival(
  orderId,
  code
) {
  return apiFetch(
    `/api/orders/${orderId}/arrival`,
    {
      method: 'POST',
      body: JSON.stringify({
        code,
      }),
    }
  )
}

// 주문 상세 조회
export function getOrder(orderId) {
  return apiFetch(
    `/api/orders/${orderId}`
  )
}
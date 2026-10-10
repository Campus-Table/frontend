// src/api/orderApi.js

import { apiFetch } from './client'

// ======================================================
// 선주문 생성 + 마일리지 결제
// POST /api/orders
// ======================================================

export function createOrder(
  storeId,
  items
) {
  return apiFetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify({
      storeId,
      items,
    }),
  })
}

// ======================================================
// 내 주문 목록
// GET /api/orders/me
// ======================================================

export function getMyOrders() {
  return apiFetch('/api/orders/me')
}

// ======================================================
// 현재 진행 중인 주문
// GET /api/orders/me/current
//
// 주문이 없으면 서버가 204를 반환하므로
// apiFetch에서 null이 반환됨
// ======================================================

export function getCurrentOrder() {
  return apiFetch(
    '/api/orders/me/current'
  )
}

// ======================================================
// 주문 상세 조회
// GET /api/orders/{orderId}
// ======================================================

export function getOrder(orderId) {
  return apiFetch(
    `/api/orders/${orderId}`
  )
}

// ======================================================
// 현장 도착 인증
// POST /api/orders/{orderId}/arrival
// ======================================================

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

// ======================================================
// 주문 취소
// POST /api/orders/{orderId}/cancel
// ======================================================

export function cancelOrder(orderId) {
  return apiFetch(
    `/api/orders/${orderId}/cancel`,
    {
      method: 'POST',
    }
  )
} 

import { apiFetch } from './client'

// ========================================
// 학식당 ID 조회
// 현재 서비스는 학식당 1개이므로
// 첫 번째 식당 사용
// ========================================

export async function getPrimaryCafeteriaId() {
  const cafeterias =
    await apiFetch(
      '/api/cafeterias'
    )

  if (
    !Array.isArray(cafeterias) ||
    cafeterias.length === 0
  ) {
    throw new Error(
      '등록된 학식당이 없습니다.'
    )
  }

  return cafeterias[0].id
}


// ========================================
// 학식당 현재 혼잡도
// currentPeople
// waitingPeople
// usageRate
// congestionLevel
// ========================================

export function getCafeteriaStatus(
  cafeteriaId
) {
  return apiFetch(
    `/api/cafeterias/${cafeteriaId}/status`
  )
}


// ========================================
// 관리자 대시보드
// currentPeople
// seatCount
// waitingPeople
// todayOrders
// ========================================

export function getAdminDashboard(
  cafeteriaId
) {
  return apiFetch(
    `/api/admin/cafeterias/${cafeteriaId}/dashboard`
  )
}


// ========================================
// 가게별 주문 현황
// ========================================

export function getAdminStoreStats(
  cafeteriaId
) {
  return apiFetch(
    `/api/admin/cafeterias/${cafeteriaId}/store-stats`
  )
}


// ========================================
// 현재 대기 현황
// ========================================

export function getAdminWaitings(
  cafeteriaId
) {
  return apiFetch(
    `/api/admin/cafeterias/${cafeteriaId}/waitings`
  )
}


// ========================================
// 시간대별 이용 인원
// ========================================

export function getHourlyUsage(
  cafeteriaId
) {
  return apiFetch(
    `/api/admin/cafeterias/${cafeteriaId}/usage/hourly`
  )
}


// ========================================
// 오늘의 현장 번호 조회
// Response:
// {
//   cafeteriaId,
//   date,
//   code
// }
// ========================================

export function getArrivalCode(
  cafeteriaId
) {
  return apiFetch(
    `/api/admin/cafeterias/${cafeteriaId}/arrival-code`
  )
}


// ========================================
// 오늘의 현장 번호 재발급
// ========================================

export function regenerateArrivalCode(
  cafeteriaId
) {
  return apiFetch(
    `/api/admin/cafeterias/${cafeteriaId}/arrival-code/regenerate`,
    {
      method: 'POST',
    }
  )
}


// ========================================
// 인원 기록 조회
// ========================================

export function getOccupancyHistory(
  cafeteriaId,
  date
) {
  return apiFetch(
    `/api/admin/cafeterias/${cafeteriaId}/occupancy/history?date=${date}`
  )
}


// ========================================
// CLOVA 이미지 인원 분석
// ========================================

export function analyzeOccupancy(
  cafeteriaId,
  file
) {
  const formData =
    new FormData()

  formData.append(
    'image',
    file
  )

  return apiFetch(
    `/api/admin/cafeterias/${cafeteriaId}/occupancy/analyze`,
    {
      method: 'POST',
      body: formData,
    }
  )
}


// ========================================
// 관리자 직접 인원 입력
//
// source를 생략하면 SIMULATION이므로
// 직접 입력 화면에서는 MANUAL 명시
// ========================================

export function saveManualOccupancy(
  cafeteriaId,
  currentPeople
) {
  return apiFetch(
    `/api/admin/cafeterias/${cafeteriaId}/occupancy`,
    {
      method: 'POST',

      body: JSON.stringify({
        currentPeople,
        source: 'MANUAL',
      }),
    }
  )
}
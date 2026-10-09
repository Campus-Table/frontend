import { useEffect, useState } from 'react'

function AdminDashboard({ onWaiting }) {
  const [dashboard, setDashboard] = useState(null)
  const [storeStats, setStoreStats] = useState([])

  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // =========================
  // 오늘 날짜
  // =========================

  const today = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date())

  // =========================
  // 관리자 대시보드 데이터 조회
  // =========================

  useEffect(() => {
    const controller = new AbortController()

    const fetchData = async () => {
      try {
        setLoading(true)
        setErrorMessage('')

        // ---------------------------------
        // 1. 현재 사용하는 학식당 ID 조회
        // 현재 식당은 1개이므로 첫 번째 항목 사용
        // ---------------------------------

        const cafeteriaResponse = await fetch(
          '/api/cafeterias',
          {
            method: 'GET',
            credentials: 'include',
            signal: controller.signal,
          }
        )

        if (!cafeteriaResponse.ok) {
          const errorData =
            await cafeteriaResponse
              .json()
              .catch(() => null)

          throw new Error(
            errorData?.message ||
              '학식당 정보를 불러오지 못했습니다.'
          )
        }

        const cafeterias =
          await cafeteriaResponse.json()

        if (
          !Array.isArray(cafeterias) ||
          cafeterias.length === 0
        ) {
          throw new Error(
            '등록된 학식당이 없습니다.'
          )
        }

        const cafeteriaId =
          cafeterias[0].id

        // ---------------------------------
        // 2. 관리자 대시보드 / 가게 통계 조회
        // ---------------------------------

        const [
          dashboardResponse,
          storeStatsResponse,
        ] = await Promise.all([
          fetch(
            `/api/admin/cafeterias/${cafeteriaId}/dashboard`,
            {
              method: 'GET',
              credentials: 'include',
              signal: controller.signal,
            }
          ),

          fetch(
            `/api/admin/cafeterias/${cafeteriaId}/store-stats`,
            {
              method: 'GET',
              credentials: 'include',
              signal: controller.signal,
            }
          ),
        ])

        // ---------------------------------
        // 3. 대시보드 조회 실패 처리
        // ---------------------------------

        if (!dashboardResponse.ok) {
          const errorData =
            await dashboardResponse
              .json()
              .catch(() => null)

          if (dashboardResponse.status === 401) {
            throw new Error(
              '로그인이 만료되었습니다. 다시 로그인해주세요.'
            )
          }

          if (dashboardResponse.status === 403) {
            throw new Error(
              '관리자 권한이 없습니다.'
            )
          }

          throw new Error(
            errorData?.message ||
              '학식당 현황을 불러오지 못했습니다.'
          )
        }

        // ---------------------------------
        // 4. 가게 통계 조회 실패 처리
        // ---------------------------------

        if (!storeStatsResponse.ok) {
          const errorData =
            await storeStatsResponse
              .json()
              .catch(() => null)

          if (storeStatsResponse.status === 401) {
            throw new Error(
              '로그인이 만료되었습니다. 다시 로그인해주세요.'
            )
          }

          if (storeStatsResponse.status === 403) {
            throw new Error(
              '관리자 권한이 없습니다.'
            )
          }

          throw new Error(
            errorData?.message ||
              '가게별 주문 현황을 불러오지 못했습니다.'
          )
        }

        // ---------------------------------
        // 5. 응답 데이터 저장
        // ---------------------------------

        const dashboardData =
          await dashboardResponse.json()

        const storeStatsData =
          await storeStatsResponse.json()

        setDashboard(dashboardData)

        setStoreStats(
          Array.isArray(storeStatsData)
            ? storeStatsData
            : []
        )
      } catch (error) {
        // fetch 취소는 오류 화면에 표시하지 않음
        if (error.name === 'AbortError') {
          return
        }

        console.error(
          '관리자 대시보드 조회 실패:',
          error
        )

        setErrorMessage(
          error.message ||
            '데이터를 불러오는 중 오류가 발생했습니다.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      controller.abort()
    }
  }, [])

  // =========================
  // 로딩 화면
  // =========================

  if (loading) {
    return (
      <div className="admin-page">
        <header className="admin-header">
          <div className="admin-brand">
            <div className="admin-brand-icon">
              ♙
            </div>

            <strong>Campus Table</strong>

            <span className="admin-badge">
              관리자
            </span>
          </div>

          <p className="admin-date">
            {today}
          </p>

          <h1>학식당 현황</h1>
        </header>

        <main className="admin-content">
          <div className="admin-state-card">
            학식당 현황을 불러오는 중입니다.
          </div>
        </main>
      </div>
    )
  }

  // =========================
  // 오류 화면
  // =========================

  if (errorMessage) {
    return (
      <div className="admin-page">
        <header className="admin-header">
          <div className="admin-brand">
            <div className="admin-brand-icon">
              ♙
            </div>

            <strong>Campus Table</strong>

            <span className="admin-badge">
              관리자
            </span>
          </div>

          <p className="admin-date">
            {today}
          </p>

          <h1>학식당 현황</h1>
        </header>

        <main className="admin-content">
          <div className="admin-state-card error">
            {errorMessage}
          </div>
        </main>
      </div>
    )
  }

  // =========================
  // 대시보드
  // =========================

  return (
    <div className="admin-page">

      <header className="admin-header">
        <div className="admin-brand">

          <div className="admin-brand-icon">
            ♙
          </div>

          <strong>
            Campus Table
          </strong>

          <span className="admin-badge">
            관리자
          </span>

        </div>

        <p className="admin-date">
          {today}
        </p>

        <h1>
          학식당 현황
        </h1>
      </header>

      <main className="admin-content">

        {/* =========================
            상단 요약
        ========================= */}

        <section className="admin-summary-grid">

          {/* 현재 이용자 */}
          <article className="admin-summary-card">

            <div className="admin-summary-icon">
              ♙
            </div>

            <p>
              현재 이용자
            </p>

            <strong>
              {dashboard?.currentPeople ?? 0}
              <span>명</span>
            </strong>

            <small className="summary-blue">
              좌석 {dashboard?.seatCount ?? 0}석
            </small>

          </article>

          {/* 전체 대기 */}
          <article className="admin-summary-card">

            <div className="admin-summary-icon">
              ◷
            </div>

            <p>
              전체 대기
            </p>

            <strong>
              {dashboard?.waitingPeople ?? 0}
              <span>명</span>
            </strong>

            <small>
              현재 대기
            </small>

          </article>

          {/* 오늘 주문 */}
          <article className="admin-summary-card">

            <div className="admin-summary-icon">
              ▤
            </div>

            <p>
              오늘 주문
            </p>

            <strong>
              {dashboard?.todayOrders ?? 0}
              <span>건</span>
            </strong>

            <small className="summary-blue">
              오늘 누적
            </small>

          </article>

        </section>

        {/* =========================
            가게별 주문 현황
        ========================= */}

        <section className="admin-store-section">

          <div className="admin-section-title">

            <div>
              <p className="admin-section-label">
                LIVE ORDERS
              </p>

              <h2>
                가게별 주문 현황
              </h2>
            </div>

            <button
              type="button"
              className="admin-text-button"
              onClick={onWaiting}
            >
              전체 대기 보기
            </button>

          </div>

          <div className="admin-store-list">

            {storeStats.map((stat) => (
              <article
                key={
                  stat.storeId ??
                  stat.id ??
                  stat.storeName
                }
                className="admin-store-card"
              >

                <div className="admin-store-top">

                  <div className="admin-store-name">

                    <span className="admin-store-dot" />

                    <strong>
                      {stat.storeName ??
                        stat.name ??
                        '가게'}
                    </strong>

                  </div>

                  <span>
                    오늘 {stat.todayOrders ?? 0}건
                  </span>

                </div>

                <p className="admin-store-wait-label">
                  현재 대기
                </p>

                <div className="admin-store-wait">

                  <strong>
                    {stat.waitingCount ?? 0}
                    <span>건</span>
                  </strong>

                  <button
                    type="button"
                    onClick={onWaiting}
                  >
                    ›
                  </button>

                </div>

                <div className="admin-card-divider" />

                <p className="admin-menu-summary">
                  {Array.isArray(stat.topMenus) &&
                  stat.topMenus.length > 0
                    ? stat.topMenus
                        .map(
                          (menu) =>
                            `${menu.menuName} ${menu.count}`
                        )
                        .join(' · ')
                    : '오늘 주문 데이터가 없습니다.'}
                </p>

              </article>
            ))}

          </div>

        </section>

      </main>

    </div>
  )
}

export default AdminDashboard
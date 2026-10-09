import {
  useEffect,
  useState,
} from 'react'

import {
  getPrimaryCafeteriaId,
  getAdminDashboard,
  getAdminStoreStats,
  getArrivalCode,
  regenerateArrivalCode,
} from '../api/adminApi'

function AdminDashboard({
  onWaiting,
  onOccupancy,
}) {
  const [cafeteriaId, setCafeteriaId] =
    useState(null)

  const [dashboard, setDashboard] =
    useState(null)

  const [storeStats, setStoreStats] =
    useState([])

  const [arrivalCode, setArrivalCode] =
    useState('')

  const [loading, setLoading] =
    useState(true)

  const [errorMessage, setErrorMessage] =
    useState('')

  const [
    showRegenerateModal,
    setShowRegenerateModal,
  ] = useState(false)

  const [
    regenerating,
    setRegenerating,
  ] = useState(false)

  // ========================================
  // 오늘 날짜
  // ========================================

  const today =
    new Intl.DateTimeFormat(
      'ko-KR',
      {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }
    ).format(new Date())

  // ========================================
  // 현장 번호 응답에서 코드 꺼내기
  // ========================================

  const getCodeValue = (data) => {
    if (!data) {
      return ''
    }

    return (
      data.code ??
      data.arrivalCode ??
      ''
    )
  }

  // ========================================
  // 데이터 조회
  // ========================================

  useEffect(() => {
    let cancelled = false

    const loadDashboard = async () => {
      try {
        setLoading(true)
        setErrorMessage('')

        const id =
          await getPrimaryCafeteriaId()

        if (cancelled) {
          return
        }

        setCafeteriaId(id)

        const [
          dashboardData,
          storeStatsData,
          arrivalCodeData,
        ] = await Promise.all([
          getAdminDashboard(id),
          getAdminStoreStats(id),
          getArrivalCode(id),
        ])

        if (cancelled) {
          return
        }

        setDashboard(dashboardData)

        setStoreStats(
          Array.isArray(storeStatsData)
            ? storeStatsData
            : []
        )

        setArrivalCode(
          getCodeValue(
            arrivalCodeData
          )
        )
      } catch (error) {
        if (cancelled) {
          return
        }

        console.error(
          '관리자 대시보드 조회 실패:',
          error
        )

        if (error.status === 401) {
          window.location.href = '/'
          return
        }

        if (error.status === 403) {
          setErrorMessage(
            '관리자 권한이 없습니다.'
          )
          return
        }

        setErrorMessage(
          error.message ||
            '데이터를 불러오지 못했습니다.'
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      cancelled = true
    }
  }, [])

  // ========================================
  // 현장 번호 재발급
  // ========================================

  const handleRegenerate = async () => {
    if (!cafeteriaId) {
      return
    }

    try {
      setRegenerating(true)

      const result =
        await regenerateArrivalCode(
          cafeteriaId
        )

      let newCode =
        getCodeValue(result)

      // 재발급 응답에 번호가 없을 경우
      // 현재 번호 다시 조회
      if (!newCode) {
        const refreshed =
          await getArrivalCode(
            cafeteriaId
          )

        newCode =
          getCodeValue(refreshed)
      }

      setArrivalCode(newCode)

      setShowRegenerateModal(false)
    } catch (error) {
      alert(
        error.message ||
          '현장 번호를 재발급하지 못했습니다.'
      )
    } finally {
      setRegenerating(false)
    }
  }

  // ========================================
  // 로딩
  // ========================================

  if (loading) {
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

          <div className="admin-state-card">
            학식당 현황을
            불러오는 중입니다.
          </div>

        </main>

      </div>
    )
  }

  // ========================================
  // 오류
  // ========================================

  if (errorMessage) {
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

          <div className="admin-state-card error">
            {errorMessage}
          </div>

        </main>

      </div>
    )
  }

  return (
    <div className="admin-page">

      {/* =====================================
          HEADER
      ===================================== */}

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

        {/* =====================================
            SUMMARY
        ===================================== */}

        <section className="admin-summary-grid">

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

        {/* =====================================
            TODAY ARRIVAL CODE
        ===================================== */}

        <section className="arrival-code-card">

          <div>

            <p className="arrival-code-label">
              TODAY ARRIVAL CODE
            </p>

            <span className="arrival-code-description">
              오늘의 현장 번호
            </span>

            <strong className="arrival-code-number">
              {arrivalCode || '----'}
            </strong>

          </div>

          <button
            type="button"
            className="arrival-code-button"
            onClick={() =>
              setShowRegenerateModal(true)
            }
          >
            재발급
          </button>

        </section>

        {/* =====================================
            OCCUPANCY MANAGEMENT
        ===================================== */}

        <button
          type="button"
          className="occupancy-manage-card"
          onClick={onOccupancy}
        >

          <div className="occupancy-manage-icon">
            ♧
          </div>

          <div className="occupancy-manage-text">

            <strong>
              인원 현황 관리
            </strong>

            <span>
              사진 분석 또는 직접 입력
            </span>

          </div>

          <span className="occupancy-manage-arrow">
            ›
          </span>

        </button>

        {/* =====================================
            STORE STATS
        ===================================== */}

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

                  {Array.isArray(
                    stat.topMenus
                  ) &&
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

      {/* =====================================
          REGENERATE MODAL
      ===================================== */}

      {showRegenerateModal && (

        <div className="admin-modal-overlay">

          <div className="admin-confirm-modal">

            <h2>
              현장 번호를 재발급하시겠어요?
            </h2>

            <p>
              아직 도착 인증하지 않은 사용자는
              <br />
              새 번호를 입력해야 합니다.
            </p>

            <div className="admin-modal-buttons">

              <button
                type="button"
                className="admin-modal-cancel"
                onClick={() =>
                  setShowRegenerateModal(false)
                }
                disabled={regenerating}
              >
                취소
              </button>

              <button
                type="button"
                className="admin-modal-confirm"
                onClick={
                  handleRegenerate
                }
                disabled={regenerating}
              >
                {regenerating
                  ? '재발급 중...'
                  : '재발급'}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default AdminDashboard
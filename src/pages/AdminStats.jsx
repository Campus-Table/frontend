import {
  useEffect,
  useState,
} from 'react'

import {
  getPrimaryCafeteriaId,
  getCafeteriaStatus,
  getAdminDashboard,
  getAdminStoreStats,
  getHourlyUsage,
  getOccupancyHistory,
} from '../api/adminApi'

import AdminAccountMenu from '../components/AdminAccountMenu'
import utensilsIcon from '../assets/utensils.svg'

function AdminStats({
  onLogout,
}) {
  const [
    dashboard,
    setDashboard,
  ] = useState(null)

  const [
    cafeteriaStatus,
    setCafeteriaStatus,
  ] = useState(null)

  const [
    storeStats,
    setStoreStats,
  ] = useState([])

  const [
    hourlyUsage,
    setHourlyUsage,
  ] = useState([])

  const [
    dataSource,
    setDataSource,
  ] = useState(null)

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('')

  // =========================
  // 오늘 날짜
  // =========================

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

  const todayApiDate =
    new Intl.DateTimeFormat(
      'en-CA',
      {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }
    ).format(new Date())

  // =========================
  // 데이터 조회
  // =========================

  useEffect(() => {
    let cancelled = false

    const loadStats =
      async () => {
        try {
          setLoading(true)
          setErrorMessage('')

          const cafeteriaId =
            await getPrimaryCafeteriaId()

          const [
            dashboardData,
            statusData,
            storesData,
            hourlyData,
            historyData,
          ] = await Promise.all([
            getAdminDashboard(
              cafeteriaId
            ),

            getCafeteriaStatus(
              cafeteriaId
            ),

            getAdminStoreStats(
              cafeteriaId
            ),

            getHourlyUsage(
              cafeteriaId
            ),

            getOccupancyHistory(
              cafeteriaId,
              todayApiDate
            ).catch(() => []),
          ])

          if (cancelled) {
            return
          }

          setDashboard(
            dashboardData
          )

          setCafeteriaStatus(
            statusData
          )

          setStoreStats(
            Array.isArray(
              storesData
            )
              ? storesData
              : []
          )

          // 0~23시 전체 시간대 표시
          const allHours =
            Array.isArray(hourlyData)
              ? hourlyData
              : []

          setHourlyUsage(
            [...allHours].sort(
              (a, b) =>
                Number(a.hour) -
                Number(b.hour)
            )
          )

          // =========================
          // 가장 최근 스냅샷 source
          // =========================

          const historyItems =
            Array.isArray(
              historyData
            )
              ? historyData
              : historyData?.items ||
                []

          if (
            historyItems.length >
            0
          ) {
            const latest =
              [...historyItems].sort(
                (a, b) =>
                  new Date(
                    b.recordedAt
                  ) -
                  new Date(
                    a.recordedAt
                  )
              )[0]

            setDataSource(
              latest?.source ||
                null
            )
          }
        } catch (error) {
          if (cancelled) {
            return
          }

          console.error(
            '관리자 이용 현황 조회 실패:',
            error
          )

          if (
            error.status === 401
          ) {
            window.location.href =
              '/'
            return
          }

          if (
            error.status === 403
          ) {
            setErrorMessage(
              '관리자 권한이 없습니다.'
            )
            return
          }

          setErrorMessage(
            error.message ||
              '이용 현황을 불러오지 못했습니다.'
          )
        } finally {
          if (!cancelled) {
            setLoading(false)
          }
        }
      }

    loadStats()

    return () => {
      cancelled = true
    }
  }, [todayApiDate])

  // =========================
  // 혼잡도 텍스트
  // =========================

  const congestionText = {
    RELAXED: '여유',
    NORMAL: '보통',
    CROWDED: '혼잡',
    VERY_CROWDED:
      '매우 혼잡',
  }

  // =========================
  // 시간대별 그래프
  // peakPeople 기준
  // =========================

  const maxPeople =
    Math.max(
      ...hourlyUsage.map(
        (item) =>
          Number(
            item.peakPeople
          ) || 0
      ),
      1
    )

  // =========================
  // 가게별 주문 비중
  // =========================

  const totalOrders =
    storeStats.reduce(
      (sum, store) =>
        sum +
        (Number(
          store.todayOrders
        ) || 0),
      0
    )

  const getPercentage = (
    orders
  ) => {
    if (totalOrders === 0) {
      return 0
    }

    return Math.round(
      (
        (Number(orders) || 0) /
        totalOrders
      ) * 100
    )
  }

  // =========================
  // 스냅샷 출처
  // =========================

  const sourceLabel = {
    CLOVA: 'CLOVA 분석',
    SIMULATION:
      '시뮬레이션 데이터',
    MANUAL: '직접 입력',
  }

  return (
    <div className="admin-page">

      <header className="admin-header">

        <div className="admin-brand">

        <div className="admin-brand-icon">
          <img src={utensilsIcon} alt="Campus Table" />
        </div>

          <strong>
            Campus Table
          </strong>

          <AdminAccountMenu
            onLogout={
              onLogout
            }
          />

        </div>

        <p className="admin-date">
          {today}
        </p>

        <h1>
          이용 현황 분석
        </h1>

      </header>

      <main className="admin-content">

        {loading && (
          <div className="admin-state-card">
            이용 현황을
            불러오는 중입니다.
          </div>
        )}

        {errorMessage && (
          <div className="admin-state-card error">
            {errorMessage}
          </div>
        )}

        {!loading &&
          !errorMessage && (
            <>

              {/* =====================
                  SUMMARY
              ===================== */}

              <section className="stats-summary-grid">

                <article className="stats-summary-card">

                  <p>
                    현재 이용 인원
                  </p>

                  <strong>
                    {cafeteriaStatus?.currentPeople ??
                      0}
                    <span>명</span>
                  </strong>

                  <small className="stats-red">

                    {congestionText[
                      cafeteriaStatus
                        ?.congestionLevel
                    ] ||
                      '정보 없음'}

                    {cafeteriaStatus?.usageRate !==
                      undefined &&
                      ` · 좌석의 ${Math.round(
                        cafeteriaStatus.usageRate
                      )}%`}

                  </small>

                </article>

                <article className="stats-summary-card">

                  <p>
                    현재 전체 대기
                  </p>

                  <strong>
                    {dashboard?.waitingPeople ??
                      cafeteriaStatus?.waitingPeople ??
                      0}
                    <span>명</span>
                  </strong>

                  <small className="stats-blue">
                    현재 대기 인원
                  </small>

                </article>

              </section>

              {/* =====================
                  시간대별 이용 인원
              ===================== */}

              <section className="stats-card">

                <div className="stats-card-header">

                  <div>
                    <p className="admin-section-label">
                      TODAY
                    </p>

                    <h2>
                      시간대별 이용 인원
                    </h2>
                  </div>

                  <div className="usage-legend">

                    <div className="usage-legend-item">
                      <span className="usage-legend-dot peak" />
                      <span>최고 이용 시간</span>
                    </div>

                    <div className="usage-legend-item">
                      <span className="usage-legend-dot normal" />
                      <span>일반 시간</span>
                    </div>

                  </div>

                </div>

                <div className="usage-chart">

                  {hourlyUsage.map(
                    (item) => {
                      const count =
                        Number(
                          item.peakPeople
                        ) || 0

                      const height =
                        (
                          count /
                          maxPeople
                        ) * 100

                      return (
                        <div
                          key={
                            item.hour
                          }
                          className="usage-column"
                        >

                          <div className="usage-bar-area">

                            <div
                              className={`usage-bar ${
                                count ===
                                maxPeople
                                  ? 'highlight'
                                  : ''
                              }`}
                              style={{
                                height:
                                  `${height}%`,
                              }}
                            />

                          </div>

                          <span>
                            {String(
                              item.hour
                            ).padStart(
                              2,
                              '0'
                            )}
                          </span>

                        </div>
                      )
                    }
                  )}

                </div>

              </section>

              {/* =====================
                  가게별 주문 비중
              ===================== */}

              <section className="store-share-section">

                <h2>
                  가게별 주문 비중
                </h2>

                <div className="store-share-card">

                  {totalOrders ===
                  0 ? (

                    <div className="stats-empty">
                      오늘 주문 데이터가
                      없습니다.
                    </div>

                  ) : (
                    <>

                      <div className="share-bar">

                        {storeStats.map(
                          (
                            store,
                            index
                          ) => (

                            <div
                              key={
                                store.storeId
                              }
                              className={`share-segment share-${
                                index % 4
                              }`}
                              style={{
                                width:
                                  `${getPercentage(
                                    store.todayOrders
                                  )}%`,
                              }}
                            />

                          )
                        )}

                      </div>

                      <div className="share-legend">

                        {storeStats.map(
                          (
                            store,
                            index
                          ) => (

                            <div
                              key={
                                store.storeId
                              }
                              className="share-item"
                            >

                              <span
                                className={`share-dot share-${
                                  index % 4
                                }`}
                              />

                              <span>
                                {store.storeName ||
                                  '가게'}
                              </span>

                              <strong>
                                {getPercentage(
                                  store.todayOrders
                                )}
                                %
                              </strong>

                            </div>

                          )
                        )}

                      </div>

                    </>
                  )}

                </div>

              </section>

            </>
          )}

      </main>

    </div>
  )
}

export default AdminStats
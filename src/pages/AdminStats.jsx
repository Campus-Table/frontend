import {
  useEffect,
  useState,
} from 'react'

import {
  getPrimaryCafeteriaId,
  getAdminDashboard,
  getAdminStoreStats,
  getHourlyUsage,
  getOccupancyHistory,
} from '../api/adminApi'

function AdminStats() {
  const [dashboard, setDashboard] =
    useState(null)

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

  const [loading, setLoading] =
    useState(true)

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('')

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

  const todayApiDate = (() => {
    const formatter =
      new Intl.DateTimeFormat(
        'en-CA',
        {
          timeZone: 'Asia/Seoul',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }
      )

    return formatter.format(
      new Date()
    )
  })()

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        setLoading(true)

        const cafeteriaId =
          await getPrimaryCafeteriaId()

        const [
          dashboardData,
          storesData,
          hourlyData,
          historyData,
        ] = await Promise.all([
          getAdminDashboard(
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

        setStoreStats(
          Array.isArray(storesData)
            ? storesData
            : []
        )

        const allHours =
          Array.isArray(hourlyData)
            ? hourlyData
            : []

        // 디자인대로 09~16시만 표시
        setHourlyUsage(
          allHours.filter(
            (item) => {
              const hour =
                Number(item.hour)

              return (
                hour >= 9 &&
                hour <= 16
              )
            }
          )
        )

        const historyItems =
          Array.isArray(historyData)
            ? historyData
            : historyData?.items ??
              []

        if (
          historyItems.length > 0
        ) {
          setDataSource(
            historyItems[0]
              ?.source ?? null
          )
        }
      } catch (error) {
        if (cancelled) {
          return
        }

        if (
          error.status === 401
        ) {
          window.location.href =
            '/'
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

    load()

    return () => {
      cancelled = true
    }
  }, [todayApiDate])

  // ========================================
  // 혼잡도
  // ========================================

  const congestionText = {
    RELAXED: '여유',
    NORMAL: '보통',
    CROWDED: '혼잡',
    VERY_CROWDED: '매우 혼잡',
  }

  // ========================================
  // 시간대 그래프
  // peakPeople 사용
  // ========================================

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

  // ========================================
  // 주문 비율
  // ========================================

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
        Number(orders) /
        totalOrders
      ) * 100
    )
  }

  // ========================================
  // 데이터 출처
  // ========================================

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

              <section className="stats-summary-grid">

                <article className="stats-summary-card">

                  <p>
                    현재 이용 인원
                  </p>

                  <strong>
                    {dashboard?.currentPeople ?? 0}
                    <span>명</span>
                  </strong>

                  <small className="stats-red">
                    {congestionText[
                      dashboard?.congestionLevel
                    ] || '정보 없음'}

                    {dashboard?.usageRate !==
                      undefined &&
                      ` · 좌석의 ${Math.round(
                        dashboard.usageRate
                      )}%`}
                  </small>

                </article>

                <article className="stats-summary-card">

                  <p>
                    현재 전체 대기
                  </p>

                  <strong>
                    {dashboard?.waitingPeople ?? 0}
                    <span>명</span>
                  </strong>

                  <small className="stats-blue">
                    현재 대기 인원
                  </small>

                </article>

              </section>

              {/* 시간대별 이용자 */}

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

                  {dataSource &&
                    sourceLabel[
                      dataSource
                    ] && (
                      <span className="stats-source-badge">
                        {
                          sourceLabel[
                            dataSource
                          ]
                        }
                      </span>
                    )}

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

              {/* 가게별 주문 비중 */}

              <section className="store-share-section">

                <h2>
                  가게별 주문 비중
                </h2>

                <div className="store-share-card">

                  {totalOrders === 0 ? (

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
                                store.storeId ??
                                index
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
                                store.storeId ??
                                index
                              }
                              className="share-item"
                            >

                              <span
                                className={`share-dot share-${
                                  index % 4
                                }`}
                              />

                              <span>
                                {store.storeName ??
                                  store.name ??
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
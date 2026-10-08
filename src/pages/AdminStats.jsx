import {
    stores,
    congestion,
    adminStoreStats,
    hourlyUsage,
    getTotalWaitingCount,
    getTodayOrderCount,
  } from '../data/mockData'
  
  function AdminStats() {
    const totalWaiting =
      getTotalWaitingCount()
  
    const totalOrders =
      getTodayOrderCount()
  
    const usageRate = Math.round(
      (
        congestion.currentUsers /
        congestion.totalSeats
      ) * 100
    )
  
    const maxUsage = Math.max(
      ...hourlyUsage.map(
        (item) => item.count
      )
    )
  
    const getStoreName = (storeId) => {
      return (
        stores.find(
          (store) => store.id === storeId
        )?.name || '가게'
      )
    }
  
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
            2026년 10월 8일
          </p>
  
          <h1>이용 현황 분석</h1>
  
        </header>
  
        <main className="admin-content">
  
          <section className="stats-summary-grid">
  
            <article className="stats-summary-card">
  
              <p>현재 이용 인원</p>
  
              <strong>
                {congestion.currentUsers}
                <span>명</span>
              </strong>
  
              <small className="stats-red">
                {congestion.status}
                {' · '}
                좌석의 {usageRate}%
              </small>
  
            </article>
  
            <article className="stats-summary-card">
  
              <p>현재 전체 대기</p>
  
              <strong>
                {totalWaiting}
                <span>명</span>
              </strong>
  
              <small className="stats-blue">
                현재 대기 인원
              </small>
  
            </article>
  
          </section>
  
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
  
              <span>
                시뮬레이션 데이터
              </span>
  
            </div>
  
            <div className="usage-chart">
  
              {hourlyUsage.map((item) => {
                const height =
                  (
                    item.count /
                    maxUsage
                  ) * 100
  
                return (
                  <div
                    key={item.hour}
                    className="usage-column"
                  >
  
                    <div className="usage-bar-area">
  
                      <div
                        className={`usage-bar ${
                          item.count === maxUsage
                            ? 'highlight'
                            : ''
                        }`}
                        style={{
                          height: `${height}%`,
                        }}
                      />
  
                    </div>
  
                    <span>
                      {item.hour}
                    </span>
  
                  </div>
                )
              })}
  
            </div>
  
          </section>
  
          <section className="store-share-section">
  
            <h2>
              가게별 주문 비중
            </h2>
  
            <div className="store-share-card">
  
              <div className="share-bar">
  
                {adminStoreStats.map(
                  (stat, index) => {
                    const percentage =
                      (
                        stat.todayOrders /
                        totalOrders
                      ) * 100
  
                    return (
                      <div
                        key={stat.storeId}
                        className={`share-segment share-${
                          index % 4
                        }`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    )
                  }
                )}
  
              </div>
  
              <div className="share-legend">
  
                {adminStoreStats.map(
                  (stat, index) => {
                    const percentage =
                      Math.round(
                        (
                          stat.todayOrders /
                          totalOrders
                        ) * 100
                      )
  
                    return (
                      <div
                        key={stat.storeId}
                        className="share-item"
                      >
  
                        <span
                          className={`share-dot share-${
                            index % 4
                          }`}
                        />
  
                        <span>
                          {getStoreName(
                            stat.storeId
                          )}
                        </span>
  
                        <strong>
                          {percentage}%
                        </strong>
  
                      </div>
                    )
                  }
                )}
  
              </div>
  
            </div>
  
          </section>
  
        </main>
  
      </div>
    )
  }
  
  export default AdminStats
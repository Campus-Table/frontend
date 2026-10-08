import {
    stores,
    congestion,
    adminStoreStats,
    getTotalWaitingCount,
    getTodayOrderCount,
  } from '../data/mockData'
  
  function AdminDashboard({ onWaiting }) {
    const totalWaiting = getTotalWaitingCount()
    const todayOrders = getTodayOrderCount()
  
    const getStore = (storeId) => {
      return stores.find((store) => store.id === storeId)
    }
  
    const getMenuName = (store, menuId) => {
      return (
        store?.menus.find((menu) => menu.id === menuId)?.name ||
        '메뉴'
      )
    }
  
    return (
      <div className="admin-page">
  
        <header className="admin-header">
          <div className="admin-brand">
            <div className="admin-brand-icon">♙</div>
  
            <strong>Campus Table</strong>
  
            <span className="admin-badge">
              관리자
            </span>
          </div>
  
          <p className="admin-date">
            2026년 10월 8일
          </p>
  
          <h1>학식당 현황</h1>
        </header>
  
        <main className="admin-content">
  
          <section className="admin-summary-grid">
  
            <article className="admin-summary-card">
              <div className="admin-summary-icon">
                ♙
              </div>
  
              <p>현재 이용자</p>
  
              <strong>
                {congestion.currentUsers}
                <span>명</span>
              </strong>
  
              <small className="summary-blue">
                좌석 {congestion.totalSeats}석
              </small>
            </article>
  
            <article className="admin-summary-card">
              <div className="admin-summary-icon">
                ◷
              </div>
  
              <p>전체 대기</p>
  
              <strong>
                {totalWaiting}
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
  
              <p>오늘 주문</p>
  
              <strong>
                {todayOrders}
                <span>건</span>
              </strong>
  
              <small className="summary-blue">
                오늘 누적
              </small>
            </article>
  
          </section>
  
          <section className="admin-store-section">
  
            <div className="admin-section-title">
  
              <div>
                <p className="admin-section-label">
                  LIVE ORDERS
                </p>
  
                <h2>가게별 주문 현황</h2>
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
  
              {adminStoreStats.map((stat) => {
                const store = getStore(stat.storeId)
  
                if (!store) {
                  return null
                }
  
                return (
                  <article
                    key={stat.storeId}
                    className="admin-store-card"
                  >
  
                    <div className="admin-store-top">
  
                      <div className="admin-store-name">
                        <span className="admin-store-dot" />
                        <strong>{store.name}</strong>
                      </div>
  
                      <span>
                        오늘 {stat.todayOrders}건
                      </span>
  
                    </div>
  
                    <p className="admin-store-wait-label">
                      현재 대기
                    </p>
  
                    <div className="admin-store-wait">
  
                      <strong>
                        {stat.waitingCount}
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
                      {stat.topMenus
                        .map((menuStat) => {
                          const menuName =
                            getMenuName(
                              store,
                              menuStat.menuId
                            )
  
                          return `${menuName} ${menuStat.count}`
                        })
                        .join(' · ')}
                    </p>
  
                  </article>
                )
              })}
  
            </div>
  
          </section>
  
        </main>
      </div>
    )
  }
  
  export default AdminDashboard
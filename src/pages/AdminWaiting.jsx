import {
    stores,
    waitingOrders,
    getTotalWaitingCount,
  } from '../data/mockData'
  
  function AdminWaiting() {
    const totalWaiting = getTotalWaitingCount()
  
    const getStore = (storeId) => {
      return stores.find((store) => store.id === storeId)
    }
  
    const getMenu = (store, menuId) => {
      return store?.menus.find(
        (menu) => menu.id === menuId
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
  
          <h1>현재 대기 현황</h1>
  
        </header>
  
        <main className="admin-content">
  
          <section className="waiting-summary">
  
            <div>
              <p>
                도착 인증 완료 주문
              </p>
  
              <strong>
                총 {totalWaiting}건
              </strong>
            </div>
  
            <span className="live-badge">
              ● 실시간 갱신
            </span>
  
          </section>
  
          <section className="waiting-list">
  
            {waitingOrders.map((order) => {
              const store =
                getStore(order.storeId)
  
              const menu =
                getMenu(store, order.menuId)
  
              return (
                <article
                  key={order.id}
                  className="waiting-card"
                >
  
                  <div className="waiting-card-top">
  
                    <strong className="waiting-number">
                      {order.waitingNumber}
                    </strong>
  
                    {order.verified && (
                      <span className="verified-badge">
                        인증 완료
                      </span>
                    )}
  
                  </div>
  
                  <h3>
                    {store?.name || '가게'}
                    {' · '}
                    {menu?.name || '메뉴'}
                  </h3>
  
                  <div className="waiting-card-divider" />
  
                  <div className="waiting-time-grid">
  
                    <div>
                      <p>대기 시작</p>
  
                      <strong>
                        {order.startedAt}
                      </strong>
                    </div>
  
                    <div>
                      <p>준비 예상까지</p>
  
                      <strong>
                        {order.remainingTime}
                      </strong>
                    </div>
  
                  </div>
  
                </article>
              )
            })}
  
          </section>
  
        </main>
  
      </div>
    )
  }
  
  export default AdminWaiting
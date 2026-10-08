function Notifications({ order, orderStatus }) {
  const storeName = order?.storeName || '가게'
  const menuName = order?.menuName || '메뉴'

  return (
    <div className="notifications-page">
      {/* 상단 */}
      <header className="notifications-header">
        <h1>알림</h1>
        <p>주문 소식을 빠르게 확인하세요.</p>
      </header>

      <main className="notifications-content">
        {/* 현장 인증 후에만 표시 */}
        {order && orderStatus === 'waiting' && (
          <>
            {/* 음식 수령 알림
                지금은 디자인 확인용으로 같이 표시.
                나중에 타이머 0분이 되면 나타나도록 연결 */}
            <section className="notification-card notification-card-primary">
              <div className="notification-icon primary-icon">
                ♧
              </div>

              <div className="notification-body">
                <div className="notification-title-row">
                  <strong>음식을 수령하러 와주세요</strong>
                  <span>방금</span>
                </div>

                <p>
                  예상 준비시간이 지났습니다. {storeName} 수령대로 와주세요.
                </p>
              </div>
            </section>

            {/* 조리 시작 */}
            <section className="notification-card">
              <div className="notification-icon">
                ◷
              </div>

              <div className="notification-body">
                <div className="notification-title-row">
                  <strong>음식 조리가 시작되었습니다</strong>
                  <span>8분 전</span>
                </div>

                <p>예상 준비시간은 약 8분입니다.</p>
              </div>
            </section>

            {/* 대기번호 */}
            <section className="notification-card">
              <div className="notification-icon">
                ▣
              </div>

              <div className="notification-body">
                <div className="notification-title-row">
                  <strong>대기번호 A-013이 발급되었습니다</strong>
                  <span>8분 전</span>
                </div>

                <p>도착 인증이 완료되어 대기번호가 발급됐어요.</p>
              </div>
            </section>
          </>
        )}

        {/* 결제 완료 후에는 항상 표시 */}
        {order && (
          <section className="notification-card">
            <div className="notification-icon">
              ✓
            </div>

            <div className="notification-body">
              <div className="notification-title-row">
                <strong>선주문이 완료되었습니다</strong>
                <span>
                  {orderStatus === 'waiting' ? '22분 전' : '방금'}
                </span>
              </div>

              <p>
                {storeName} {menuName} 결제가 완료됐어요.
              </p>
            </div>
          </section>
        )}

        {/* 주문이 아예 없을 때 */}
        {!order && (
          <div className="notification-empty">
            <div className="notification-empty-icon">♧</div>
            <strong>아직 알림이 없어요</strong>
            <p>주문을 시작하면 진행 상황을 알려드릴게요.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default Notifications
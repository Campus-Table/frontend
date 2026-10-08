import { formatPrice } from '../data/mockData'

function OrderComplete({ order, onVerify }) {
  if (!order) {
    return (
      <div className="order-complete-page">
        <header className="order-complete-header">
          <h2>선주문 완료</h2>
        </header>

        <div className="order-complete-empty">
          주문 정보를 불러올 수 없습니다.
        </div>
      </div>
    )
  }

  const usedMileage = order.usedMileage ?? order.price

  return (
    <div className="order-complete-page">
      {/* 상단 제목 */}
      <header className="order-complete-header">
        <h2>선주문 완료</h2>
      </header>

      <main className="order-complete-content">
        {/* 완료 표시 */}
        <section className="complete-message">
          <div className="complete-check-wrap">
            <div className="complete-check">
              ✓
            </div>
          </div>

          <h1>선주문이 완료됐어요</h1>

          <p>
            결제 마일리지 {usedMileage.toLocaleString()}P
          </p>
        </section>

        {/* 주문한 메뉴 */}
        <section className="complete-order-card">
          <div className="complete-menu-image">
            🍽️
          </div>

          <div className="complete-menu-info">
            <span className="complete-store-name">
              {order.storeName}
            </span>

            <h3>
              {order.menuName}
            </h3>

            <div className="complete-menu-bottom">
              <span>수량 1개</span>

              <strong>
                {formatPrice(order.price)}
              </strong>
            </div>
          </div>
        </section>

        {/* 조리 시작 전 안내 */}
        <section className="cooking-notice-card">
          <div className="cooking-notice-top">
            <div className="cooking-clock">
              ◷
            </div>

            <strong>
              아직 음식 조리가 시작되지 않았습니다
            </strong>
          </div>

          <p>
            학생식당에 도착한 뒤 현장 번호를 입력하면
            대기번호가 발급되고 조리가 시작됩니다.
          </p>
        </section>

        {/* 방문 안내 */}
        <div className="visit-notice">
          <span className="visit-notice-icon">
            ⓘ
          </span>

          <p>
            원하는 시간에 방문하세요. 예약된 방문 시간은 없습니다.
          </p>
        </div>
      </main>

      {/* 하단 버튼 */}
      <div className="complete-bottom">
        <button
          type="button"
          className="complete-verify-button"
          onClick={onVerify}
        >
          학생식당 도착 후 인증하기
        </button>
      </div>
    </div>
  )
}

export default OrderComplete
import { formatPrice } from '../data/mockData'

function OrderConfirm({ order, onBack, onPay }) {
  const mileage = 15000

  if (!order) {
    return (
      <div className="order-confirm-page">
        <header className="order-confirm-header">
          <button
            type="button"
            className="order-confirm-back"
            onClick={onBack}
            aria-label="뒤로가기"
          >
            ‹
          </button>

          <h2>주문 확인</h2>

          <div className="order-confirm-header-space" />
        </header>

        <div className="order-empty">
          주문 정보를 불러올 수 없습니다.
        </div>
      </div>
    )
  }

  const remainingMileage = mileage - order.price
  const canPay = remainingMileage >= 0

  const handlePay = () => {
    if (!canPay) return

    if (onPay) {
      onPay({
        ...order,
        usedMileage: order.price,
        remainingMileage,
      })
    }
  }

  return (
    <div className="order-confirm-page">
      <header className="order-confirm-header">
        <button
          type="button"
          className="order-confirm-back"
          onClick={onBack}
          aria-label="뒤로가기"
        >
          ‹
        </button>

        <h2>주문 확인</h2>

        <div className="order-confirm-header-space" />
      </header>

      <main className="order-confirm-content">
        <section className="order-confirm-section">
          <h3 className="order-confirm-section-title">
            주문 메뉴
          </h3>

          <div className="order-menu-card">
            <div className="order-menu-image">
              🍽️
            </div>

            <div className="order-menu-info">
              <span className="order-store-name">
                {order.storeName}
              </span>

              <h4>{order.menuName}</h4>

              <div className="order-menu-bottom">
                <span>수량 1개</span>
                <strong>{formatPrice(order.price)}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="order-confirm-section">
          <h3 className="order-confirm-section-title">
            마일리지 결제
          </h3>

          <div className="mileage-card">
            <div className="mileage-row">
              <span>보유 마일리지</span>
              <strong>{mileage.toLocaleString()}P</strong>
            </div>

            <div className="mileage-divider" />

            <div className="mileage-row">
              <span>결제 금액</span>
              <strong className="payment-minus">
                - {order.price.toLocaleString()}P
              </strong>
            </div>

            <div className="remaining-mileage">
              <span>결제 후 잔액</span>

              <strong>
                {remainingMileage.toLocaleString()}P
              </strong>
            </div>

            {!canPay && (
              <p className="mileage-warning">
                마일리지가 부족합니다.
              </p>
            )}
          </div>
        </section>

        <div className="order-notice">
          <div className="order-notice-icon">ⓘ</div>

          <p>
            결제 후 학생식당 현장에 도착해 인증하면 조리가
            시작됩니다.
            <br />
            방문 시간은 따로 예약하지 않아요.
          </p>
        </div>
      </main>

      <div className="order-payment-bottom">
        <button
          type="button"
          className="order-payment-button"
          disabled={!canPay}
          onClick={handlePay}
        >
          {canPay
            ? `${order.price.toLocaleString()}P 마일리지로 결제하기`
            : '마일리지가 부족합니다'}
        </button>
      </div>
    </div>
  )
}

export default OrderConfirm
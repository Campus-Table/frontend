function OrderPayment({
  order,
  mileage,
  onBack,
  onCharge,
  onPayment,
}) {
  if (!order) {
    return null
  }

  // 주문 금액
  const price = Number(order.price || 0)

  // 결제 후 남는 마일리지
  const remainingMileage = mileage - price

  // 마일리지 부족 여부
  const isInsufficient = remainingMileage < 0

  // 메뉴명 데이터 구조가 달라도 대응
  const menuName =
    order.menuName ||
    order.name ||
    '선택 메뉴'

  // 가게명 데이터 구조가 달라도 대응
  const storeName =
    order.storeName ||
    '경성카츠'

  // 이미지가 있는 경우
  const menuImage =
    order.image ||
    order.imageUrl ||
    null

  return (
    <main className="order-payment-page">

      {/* =========================================
          상단 뒤로가기
      ========================================= */}
      <header className="payment-header">

        <button
          type="button"
          className="payment-back"
          onClick={onBack}
          aria-label="뒤로가기"
        >
          ‹
        </button>

      </header>

      {/* =========================================
          주문 메뉴
      ========================================= */}
      <section className="payment-order-section">

        <h2 className="payment-section-title">
          주문 메뉴
        </h2>

        <div className="payment-menu-card">

          <div className="payment-menu-left">

            {menuImage ? (
              <img
                className="payment-menu-image"
                src={menuImage}
                alt={menuName}
              />
            ) : (
              <div className="payment-menu-placeholder">
                🍱
              </div>
            )}

            <div className="payment-menu-info">

              <span className="payment-store-name">
                {storeName}
              </span>

              <h3>
                {menuName}
              </h3>

              <p>
                수량 1개
              </p>

            </div>

          </div>

          <strong className="payment-menu-price">
            {price.toLocaleString()}원
          </strong>

        </div>

      </section>

      {/* =========================================
          마일리지 결제
      ========================================= */}
      <section className="mileage-payment-section">

        <div className="mileage-title-row">

          <h2 className="payment-section-title">
            마일리지 결제
          </h2>

          <button
            type="button"
            className="mileage-charge-link"
            onClick={onCharge}
          >
            충전하기
          </button>

        </div>

        <div className="mileage-card">

          {/* 보유 마일리지 */}
          <div className="mileage-row">

            <span>
              보유 마일리지
            </span>

            <strong>
              {mileage.toLocaleString()}P
            </strong>

          </div>

          {/* 주문 금액 */}
          <div className="mileage-row">

            <span>
              주문 금액
            </span>

            <strong className="payment-minus">
              -{price.toLocaleString()}P
            </strong>

          </div>

          <div className="payment-divider" />

          {/* 결제 후 잔액 */}
          <div className="mileage-row payment-result">

            <span>
              결제 후 잔액
            </span>

            <strong>
              {Math.max(
                remainingMileage,
                0
              ).toLocaleString()}P
            </strong>

          </div>

          {/* 마일리지 부족 */}
          {isInsufficient && (
            <>
              <div className="mileage-error">

                <span className="mileage-error-icon">
                  ⓘ
                </span>

                <span>
                  마일리지가 부족해요.
                </span>

              </div>

              <button
                type="button"
                className="mileage-charge-button"
                onClick={onCharge}
              >
                마일리지 충전하기
              </button>
            </>
          )}

        </div>

      </section>

      {/* =========================================
          안내
      ========================================= */}
      <div className="payment-notice">

        <span className="payment-notice-icon">
          ⓘ
        </span>

        <p>
          결제 후 학식당 현장에 도착해 인증하면
          조리가 시작됩니다.
          <br />
          방문 시간은 따로 예약하지 않아요.
        </p>

      </div>

      {/* =========================================
          하단 결제 버튼
      ========================================= */}
      <div className="payment-bottom">

        <button
          type="button"
          className="payment-submit"
          disabled={isInsufficient}
          onClick={onPayment}
        >
          {price.toLocaleString()}P 마일리지로 결제하기
        </button>

      </div>

    </main>
  )
}

export default OrderPayment  


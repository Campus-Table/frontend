import { useState } from 'react'
import { formatPrice } from '../data/mockData'

function OrderComplete({
  order,
  onVerify,
  onCancel,
}) {
  const [showCancelModal, setShowCancelModal] = useState(false)

  if (!order) {
    return (
      <main className="order-complete-page">
        <div className="order-complete-empty">
          주문 정보를 불러올 수 없습니다.
        </div>
      </main>
    )
  }

  // 결제 마일리지
  const usedMileage =
    order.usedMileage ??
    order.price ??
    0

  // 메뉴명
  const menuName =
    order.menuName ||
    order.name ||
    '선택 메뉴'

  // 가게명
  const storeName =
    order.storeName ||
    '경성카츠'

  // 메뉴 이미지
  const menuImage =
    order.image ||
    order.imageUrl ||
    null

  // =====================================
  // 주문 취소 확인
  // =====================================
  const handleCancelConfirm = () => {
    setShowCancelModal(false)

    if (onCancel) {
      onCancel()
    }
  }

  return (
    <main className="order-complete-page">

      <div className="order-complete-content">

        {/* =====================================
            선주문 완료
        ===================================== */}
        <section className="complete-message">

          <div className="complete-check-wrap">
            <div className="complete-check">
              ✓
            </div>
          </div>

          <h1>
            선주문이 완료됐어요
          </h1>

          <p>
            결제 마일리지{' '}
            {Number(usedMileage).toLocaleString()}P
          </p>

        </section>

        {/* =====================================
            주문 메뉴
        ===================================== */}
        <section className="complete-order-card">

          {menuImage ? (
            <img
              src={menuImage}
              alt={menuName}
              className="complete-menu-image"
            />
          ) : (
            <div className="complete-menu-image complete-menu-placeholder">
              🍱
            </div>
          )}

          <div className="complete-menu-info">

            <span className="complete-store-name">
              {storeName}
            </span>

            <h3>
              {menuName}
            </h3>

            <div className="complete-menu-bottom">

              <span>
                수량 1개
              </span>

              <strong>
                {formatPrice(
                  Number(order.price || 0)
                )}
              </strong>

            </div>

          </div>

        </section>

        {/* =====================================
            조리 시작 전 안내
        ===================================== */}
        <section className="cooking-notice-card">

          <div className="cooking-notice-top">

            <div className="cooking-clock">
              ⓘ
            </div>

            <strong>
              아직 조리가 시작되지 않았어요
            </strong>

          </div>

          <p>
            학생식당에 도착한 뒤 현장 번호로
            도착 인증을 해주세요.
            인증 후 대기번호가 발급되고
            조리가 시작됩니다.
          </p>

        </section>

        {/* =====================================
            방문 안내
        ===================================== */}
        <div className="visit-notice">

          <span className="visit-notice-icon">
            ⓘ
          </span>

          <p>
            원하는 시간에 방문하세요.
            예약된 방문 시간은 없습니다.
          </p>

        </div>

      </div>

      {/* =====================================
          하단 영역
      ===================================== */}
      <div className="complete-bottom-area">

        <button
          type="button"
          className="complete-cancel-button"
          onClick={() => setShowCancelModal(true)}
        >
          주문 취소
        </button>

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

      {/* =====================================
          주문 취소 확인 모달
      ===================================== */}
      {showCancelModal && (
        <div
          className="cancel-modal-overlay"
          onClick={() => setShowCancelModal(false)}
        >

          <div
            className="cancel-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="cancel-modal-text">

              <h2>
                주문을 취소하시겠어요?
              </h2>

              <p>
                주문 취소 시 결제 금액의 50%만 환불됩니다.
              </p>

            </div>

            <button
              type="button"
              className="cancel-continue-button"
              onClick={() => setShowCancelModal(false)}
            >
              계속 주문하기
            </button>

            <button
              type="button"
              className="cancel-confirm-button"
              onClick={handleCancelConfirm}
            >
              50% 환불받고 취소하기
            </button>

          </div>

        </div>
      )}

    </main>
  )
}

export default OrderComplete  


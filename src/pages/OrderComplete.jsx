import { useState } from 'react'

import {
  cancelOrder,
} from '../api/orderApi'

function OrderComplete({
  order,
  onVerify,
  onCancel,
}) {
  const [
    showCancelModal,
    setShowCancelModal,
  ] = useState(false)

  const [
    isCancelling,
    setIsCancelling,
  ] = useState(false)

  const [
    cancelError,
    setCancelError,
  ] = useState('')

  // ======================================================
  // 주문 정보 없음
  // ======================================================

  if (!order) {
    return (
      <main className="order-complete-page">

        <div className="order-complete-empty">
          주문 정보를 불러올 수 없습니다.
        </div>

      </main>
    )
  }

  // ======================================================
  // 서버 주문 응답 기준 데이터
  // ======================================================

  const orderId =
    order.orderId

  const usedMileage =
    Number(
      order.totalPrice ??
      order.usedMileage ??
      order.price ??
      0
    )

  const firstItem =
    order.items?.[0]

  const menuName =
    firstItem?.menuName ||
    order.menuName ||
    order.name ||
    '선택 메뉴'

  const quantity =
    Number(
      firstItem?.quantity ?? 1
    )

  const unitPrice =
    Number(
      firstItem?.unitPrice ??
      order.price ??
      0
    )

  const storeName =
    order.storeName ||
    '매장'

  const menuImage =
    order.image ||
    order.imageUrl ||
    null

  // ======================================================
  // 가격 표시
  // ======================================================

  const formatPrice = (price) => {
    return `${Number(
      price || 0
    ).toLocaleString('ko-KR')}원`
  }

  // ======================================================
  // 도착 인증 화면 이동
  // ======================================================

  const handleVerify = () => {
    if (onVerify) {
      onVerify(order)
    }
  }

  // ======================================================
  // 주문 취소
  // ======================================================

  const handleCancelConfirm =
    async () => {
      if (!orderId || isCancelling) {
        return
      }

      try {
        setIsCancelling(true)
        setCancelError('')

        const cancelledOrder =
          await cancelOrder(orderId)

        setShowCancelModal(false)

        if (onCancel) {
          onCancel(cancelledOrder)
        }
      } catch (error) {
        console.error(
          '주문 취소 실패:',
          error
        )

        switch (error.code) {
          case 'INVALID_ORDER_STATUS':
            setCancelError(
              '현재 상태에서는 주문을 취소할 수 없습니다.'
            )
            break

          case 'ORDER_NOT_FOUND':
            setCancelError(
              '주문 정보를 찾을 수 없습니다.'
            )
            break

          case 'FORBIDDEN':
            setCancelError(
              '이 주문을 취소할 권한이 없습니다.'
            )
            break

          case 'UNAUTHORIZED':
            setCancelError(
              '로그인이 필요합니다.'
            )
            break

          default:
            setCancelError(
              error.message ||
                '주문 취소에 실패했습니다.'
            )
        }
      } finally {
        setIsCancelling(false)
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
            {usedMileage.toLocaleString()}P
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
                수량 {quantity}개
              </span>

              <strong>
                {formatPrice(
                  unitPrice * quantity
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
          disabled={isCancelling}
          onClick={() => {
            setCancelError('')
            setShowCancelModal(true)
          }}
        >
          주문 취소
        </button>

        <div className="complete-bottom">

          <button
            type="button"
            className="complete-verify-button"
            onClick={handleVerify}
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
          onClick={() => {
            if (!isCancelling) {
              setShowCancelModal(false)
            }
          }}
        >

          <div
            className="cancel-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="cancel-modal-text">

              <h2>
                주문을 취소하시겠어요?
              </h2>

              <p>
                도착 인증 전 주문을 취소하면
                결제한 마일리지가 100% 환불됩니다.
              </p>

              {cancelError && (
                <p className="mileage-warning">
                  {cancelError}
                </p>
              )}

            </div>

            <button
              type="button"
              className="cancel-continue-button"
              disabled={isCancelling}
              onClick={() =>
                setShowCancelModal(false)
              }
            >
              계속 주문하기
            </button>

            <button
              type="button"
              className="cancel-confirm-button"
              disabled={isCancelling}
              onClick={
                handleCancelConfirm
              }
            >
              {isCancelling
                ? '주문 취소 중...'
                : '100% 환불받고 취소하기'}
            </button>

          </div>

        </div>
      )}

    </main>
  )
}

export default OrderComplete

import {
  useEffect,
  useState,
} from 'react'

import {
  getMileage,
} from '../api/mileageApi'

import {
  createOrder,
} from '../api/orderApi'

function OrderConfirm({
  order,
  onBack,
  onPay,
  onCharge,
}) {
  const [
    mileage,
    setMileage,
  ] = useState(0)

  const [
    isLoadingMileage,
    setIsLoadingMileage,
  ] = useState(true)

  const [
    isPaying,
    setIsPaying,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  const [
    paymentError,
    setPaymentError,
  ] = useState('')

  // ======================================================
  // 현재 마일리지 조회
  // ======================================================

  useEffect(() => {
    let cancelled = false

    const loadMileage = async () => {
      try {
        setIsLoadingMileage(true)
        setError('')

        const data =
          await getMileage()

        if (cancelled) {
          return
        }

        setMileage(
          Number(data?.balance ?? 0)
        )
      } catch (error) {
        if (cancelled) {
          return
        }

        console.error(
          '마일리지 조회 실패:',
          error
        )

        if (
          error.code === 'UNAUTHORIZED'
        ) {
          setError(
            '로그인이 필요합니다.'
          )
        } else {
          setError(
            error.message ||
              '마일리지 정보를 불러오지 못했습니다.'
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoadingMileage(false)
        }
      }
    }

    loadMileage()

    return () => {
      cancelled = true
    }
  }, [])

  // ======================================================
  // 주문 정보 없음
  // ======================================================

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

          <h2>
            주문 확인
          </h2>

          <div className="order-confirm-header-space" />

        </header>

        <div className="order-empty">
          주문 정보를 불러올 수 없습니다.
        </div>

      </div>
    )
  }

  // ======================================================
  // 주문 메뉴 목록
  // ======================================================

  const orderItems =
    Array.isArray(order.items)
      ? order.items
      : []

  // ======================================================
  // 전체 주문 금액
  // ======================================================

  const orderPrice =
    orderItems.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    )

  // ======================================================
  // 전체 주문 수량
  // ======================================================

  const totalQuantity =
    orderItems.reduce(
      (sum, item) =>
        sum +
        Number(item.quantity || 0),
      0
    )

  // ======================================================
  // 결제 가능 여부
  // ======================================================

  const remainingMileage =
    mileage - orderPrice

  const canPay =
    !isLoadingMileage &&
    !error &&
    orderItems.length > 0 &&
    orderPrice > 0 &&
    remainingMileage >= 0 &&
    !isPaying

  // ======================================================
  // 가격 표시
  // ======================================================

  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined
    ) {
      return '가격 정보 없음'
    }

    return `${Number(
      price
    ).toLocaleString('ko-KR')}원`
  }

  // ======================================================
  // 주문 생성 + 마일리지 결제
  // ======================================================

  const handlePay = async () => {
    if (!canPay) {
      return
    }

    try {
      setIsPaying(true)
      setPaymentError('')

      // 서버에는 menuId와 quantity만 전달
      const requestItems =
        orderItems.map((item) => ({
          menuId: item.menuId,
          quantity: Number(
            item.quantity
          ),
        }))

      const createdOrder =
        await createOrder(
          order.storeId,
          requestItems
        )

      // 서버에서 주문 생성과 동시에
      // 마일리지가 차감됨
      const usedMileage =
        Number(
          createdOrder?.totalPrice ??
            orderPrice
        )

      const newRemainingMileage =
        mileage - usedMileage

      setMileage(
        newRemainingMileage
      )

      if (onPay) {
        onPay({
          ...order,
          ...createdOrder,

          // 화면에서 선택했던 메뉴 정보도
          // 다음 화면에서 사용할 수 있도록 유지
          items:
            createdOrder?.items ??
            orderItems,

          totalQuantity,

          usedMileage,

          remainingMileage:
            newRemainingMileage,
        })
      }
    } catch (error) {
      console.error(
        '주문 생성 실패:',
        error
      )
    
      switch (error.code) {
        case 'INSUFFICIENT_MILEAGE':
          setPaymentError(
            '마일리지가 부족합니다. 충전 후 다시 시도해주세요.'
          )
          break
    
        case 'ACTIVE_ORDER_EXISTS':
          setPaymentError(
            '이미 진행 중인 주문이 있어요. 기존 주문이 완료된 후 다시 주문해주세요.'
          )
          break
    
        case 'MENU_UNAVAILABLE':
          setPaymentError(
            '현재 판매하지 않는 메뉴가 포함되어 있습니다.'
          )
          break
    
        case 'MENU_NOT_FOUND':
          setPaymentError(
            '메뉴 정보를 찾을 수 없습니다.'
          )
          break
    
        case 'STORE_NOT_FOUND':
          setPaymentError(
            '가게 정보를 찾을 수 없습니다.'
          )
          break
    
        case 'VALIDATION_FAILED':
          setPaymentError(
            '주문 정보를 다시 확인해주세요.'
          )
          break
    
        case 'UNAUTHORIZED':
          setPaymentError(
            '로그인이 필요합니다.'
          )
          break
    
        default:
          setPaymentError(
            error.message ||
              '주문을 처리하지 못했습니다. 다시 시도해주세요.'
          )
      }
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <div className="order-confirm-page">

      {/* ==================================================
          상단 헤더
      ================================================== */}

      <header className="order-confirm-header">

        <button
          type="button"
          className="order-confirm-back"
          onClick={onBack}
          aria-label="뒤로가기"
        >
          ‹
        </button>

        <h2>
          주문 확인
        </h2>

        <div className="order-confirm-header-space" />

      </header>

      <main className="order-confirm-content">

        {/* ==================================================
            주문 메뉴
        ================================================== */}

        <section className="order-confirm-section">

          <h3 className="order-confirm-section-title">
            주문 메뉴
          </h3>

          {orderItems.map(
            (item, index) => {

              const itemTotal =
                Number(
                  item.price || 0
                ) *
                Number(
                  item.quantity || 0
                )

              return (
                <div
                  className="order-menu-card"
                  key={
                    item.menuId ??
                    index
                  }
                >

                  <div className="order-menu-image">
                    🍽️
                  </div>

                  <div className="order-menu-info">

                    <span className="order-store-name">
                      {order.storeName}
                    </span>

                    <h4>
                      {item.menuName}
                    </h4>

                    <div className="order-menu-bottom">

                      <span>
                        수량{' '}
                        {Number(
                          item.quantity
                        )}개
                      </span>

                      <strong>
                        {formatPrice(
                          itemTotal
                        )}
                      </strong>

                    </div>

                  </div>

                </div>
              )
            }
          )}

          {orderItems.length > 1 && (
            <div className="order-menu-summary">

              <span>
                총 {totalQuantity}개
              </span>

              <strong>
                {formatPrice(
                  orderPrice
                )}
              </strong>

            </div>
          )}

        </section>

        {/* ==================================================
            마일리지 결제
        ================================================== */}

        <section className="order-confirm-section">

          <h3 className="order-confirm-section-title">
            마일리지 결제
          </h3>

          <div className="mileage-card">

            <div className="mileage-row">

              <span>
                보유 마일리지
              </span>

              <strong>
                {isLoadingMileage
                  ? '조회 중'
                  : `${mileage.toLocaleString()}P`}
              </strong>

            </div>

            <div className="mileage-divider" />

            <div className="mileage-row">

              <span>
                결제 금액
              </span>

              <strong className="payment-minus">
                - {orderPrice.toLocaleString()}P
              </strong>

            </div>

            <div className="remaining-mileage">

              <span>
                결제 후 잔액
              </span>

              <strong>
                {isLoadingMileage
                  ? '-'
                  : `${Math.max(
                    remainingMileage,
                    0
                  ).toLocaleString()}P`}
              </strong>

            </div>

            {!isLoadingMileage && (
              <div className="mileage-charge-guide">

                {remainingMileage < 0 && (
                  <p className="mileage-warning">
                    마일리지가 부족합니다.
                  </p>
                )}

                <button
                  type="button"
                  className="mileage-charge-button"
                  onClick={onCharge}
                >
                  마일리지 충전하기
                </button>

              </div>
            )}

          </div>

        </section>

        {/* ==================================================
            주문 안내
        ================================================== */}

        {paymentError && (
          <div className="order-payment-error">

            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
              />
              <path d="M12 8v5" />
              <path d="M12 16h.01" />
            </svg>

            <span>
              {paymentError}
            </span>

          </div>
        )}
        
        <div className="order-notice">

          <div className="order-notice-icon">
            ⓘ
          </div>

          <p>
            결제 후 학생식당 현장에 도착해 인증하면 조리가
            시작됩니다.
            <br />
            방문 시간은 따로 예약하지 않아요.
          </p>

        </div>

      </main>

      {/* ==================================================
          결제 버튼
      ================================================== */}

      <div className="order-payment-bottom">

        <button
          type="button"
          className="order-payment-button"
          disabled={!canPay}
          onClick={handlePay}
        >
          {isPaying
            ? '주문 처리 중...'
            : isLoadingMileage
              ? '마일리지 확인 중...'
              : remainingMileage < 0
                ? '마일리지가 부족합니다'
                : `${orderPrice.toLocaleString()}P 마일리지로 결제하기`}
        </button>

      </div>

    </div>
  )
}

export default OrderConfirm 
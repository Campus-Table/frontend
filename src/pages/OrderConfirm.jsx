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
  // 결제 가능 여부
  // ======================================================

  const orderPrice =
    Number(order.price || 0)

  const remainingMileage =
    mileage - orderPrice

  const canPay =
    !isLoadingMileage &&
    !error &&
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
      setError('')

      const createdOrder =
        await createOrder(
          order.storeId,
          order.menuId
        )

      // 서버에서 주문 생성과 동시에
      // 마일리지를 차감하므로
      // 프론트에서는 별도 차감 API를 호출하지 않음.
      const newRemainingMileage =
        mileage -
        Number(
          createdOrder?.totalPrice ??
          orderPrice
        )

      setMileage(
        newRemainingMileage
      )

      if (onPay) {
        onPay({
          ...order,
          ...createdOrder,

          usedMileage:
            createdOrder?.totalPrice ??
            orderPrice,

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
          setError(
            '마일리지가 부족합니다.'
          )
          break

        case 'ACTIVE_ORDER_EXISTS':
          setError(
            '이미 진행 중인 주문이 있습니다.'
          )
          break

        case 'MENU_UNAVAILABLE':
          setError(
            '현재 판매하지 않는 메뉴입니다.'
          )
          break

        case 'MENU_NOT_FOUND':
          setError(
            '메뉴 정보를 찾을 수 없습니다.'
          )
          break

        case 'STORE_NOT_FOUND':
          setError(
            '가게 정보를 찾을 수 없습니다.'
          )
          break

        case 'VALIDATION_FAILED':
          setError(
            '주문 정보를 다시 확인해주세요.'
          )
          break

        case 'UNAUTHORIZED':
          setError(
            '로그인이 필요합니다.'
          )
          break

        default:
          setError(
            error.message ||
            '주문을 처리하지 못했습니다.'
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

          <div className="order-menu-card">

            <div className="order-menu-image">
              🍽️
            </div>

            <div className="order-menu-info">

              <span className="order-store-name">
                {order.storeName}
              </span>

              <h4>
                {order.menuName}
              </h4>

              <div className="order-menu-bottom">

                <span>
                  수량 1개
                </span>

                <strong>
                  {formatPrice(
                    orderPrice
                  )}
                </strong>

              </div>

            </div>

          </div>

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

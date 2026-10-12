import {
  useEffect,
  useState,
} from 'react'

import {
  cancelOrder,
} from '../api/orderApi'

import {
  attachImagesToOrder,
} from '../utils/orderImages'

function OrderComplete({
  order,
  onVerify,
  onCancel,
}) {
  // ======================================================
  // 이미지가 보완된 현재 주문
  // ======================================================

  const [
    currentOrder,
    setCurrentOrder,
  ] = useState(order)

  const [
    isLoadingImage,
    setIsLoadingImage,
  ] = useState(false)

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
  // order가 들어오거나 변경될 때
  // 메뉴 API를 조회해서 imageUrl 자동 연결
  //
  // 주문 API
  // storeId + menuId
  //
  // ↓
  //
  // /api/stores/{storeId}/menus
  //
  // ↓
  //
  // menuId === menu.id
  //
  // ↓
  //
  // imageUrl 연결
  // ======================================================

  useEffect(() => {
    let cancelled = false

    const loadOrderImage =
      async () => {
        if (!order) {
          setCurrentOrder(order)
          return
        }

        try {
          setIsLoadingImage(true)

          const orderWithImages =
            await attachImagesToOrder(
              order
            )

          if (cancelled) {
            return
          }

          setCurrentOrder(
            orderWithImages
          )
        } catch (error) {
          console.error(
            '주문 메뉴 이미지 연결 실패:',
            error
          )

          if (!cancelled) {
            setCurrentOrder(order)
          }
        } finally {
          if (!cancelled) {
            setIsLoadingImage(false)
          }
        }
      }

    loadOrderImage()

    return () => {
      cancelled = true
    }
  }, [order])

  // ======================================================
  // 주문 정보 없음
  // ======================================================

  if (!currentOrder) {
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
    currentOrder.orderId ??
    currentOrder.id

  const usedMileage =
    Number(
      currentOrder.totalPrice ??
      currentOrder.usedMileage ??
      0
    )

  const storeName =
    currentOrder.storeName ||
    currentOrder.store?.name ||
    '매장'

  // ======================================================
  // 주문 메뉴 목록
  // ======================================================

  const orderItems =
    Array.isArray(
      currentOrder.items
    )
      ? currentOrder.items
      : []

  // ======================================================
  // 전체 주문 수량
  // ======================================================

  const totalQuantity =
    orderItems.reduce(
      (sum, item) =>
        sum +
        Number(
          item.quantity || 0
        ),
      0
    )

  // ======================================================
  // 가격 표시
  // ======================================================

  const formatPrice = (price) => {
    return `${Number(
      price || 0
    ).toLocaleString('ko-KR')}원`
  }

  // ======================================================
  // 메뉴 가격 계산
  // ======================================================

  const getItemUnitPrice = (
    item
  ) => {
    return Number(
      item.unitPrice ??
      item.price ??
      item.menu?.price ??
      0
    )
  }

  // ======================================================
  // 메뉴 이름
  // ======================================================

  const getItemName = (
    item
  ) => {
    return (
      item.menuName ||
      item.name ||
      item.menu?.name ||
      '선택 메뉴'
    )
  }

  // ======================================================
  // 메뉴 이미지
  //
  // attachImagesToOrder에서 붙여준
  // imageUrl까지 사용
  // ======================================================

  const getItemImage = (
    item
  ) => {
    return (
      item.imageUrl ||
      item.image ||
      item.menuImageUrl ||
      item.menu?.imageUrl ||
      item.menu?.image ||
      null
    )
  }

  // ======================================================
  // 도착 인증 화면 이동
  //
  // 반드시 currentOrder를 넘겨야
  // 새로 연결한 imageUrl도 다음 화면까지 전달됨
  // ======================================================

  const handleVerify = () => {
    if (onVerify) {
      onVerify(
        currentOrder
      )
    }
  }

  // ======================================================
  // 주문 취소
  // ======================================================

  const handleCancelConfirm =
    async () => {
      if (
        !orderId ||
        isCancelling
      ) {
        return
      }

      try {
        setIsCancelling(true)
        setCancelError('')

        const cancelledOrder =
          await cancelOrder(
            orderId
          )

        setShowCancelModal(
          false
        )

        if (onCancel) {
          onCancel(
            cancelledOrder
          )
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
            {usedMileage.toLocaleString()}
            P
          </p>

        </section>

        {/* =====================================
            주문 메뉴
        ===================================== */}

        <section className="complete-order-list">

          {orderItems.map(
            (item, index) => {
              const quantity =
                Number(
                  item.quantity ??
                    1
                )

              const unitPrice =
                getItemUnitPrice(
                  item
                )

              const itemTotal =
                unitPrice *
                quantity

              const menuName =
                getItemName(
                  item
                )

              const menuImage =
                getItemImage(
                  item
                )

              return (
                <div
                  className="complete-order-card"
                  key={
                    item.menuId ??
                    item.id ??
                    index
                  }
                >

                  {/* =====================================
                      실제 음식 사진
                  ===================================== */}

                  {menuImage ? (
                    <img
                      src={
                        menuImage
                      }
                      alt={
                        menuName
                      }
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
                        수량{' '}
                        {quantity}개
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

        </section>

        {/* =====================================
            전체 주문 요약
        ===================================== */}

        {orderItems.length >
          1 && (
          <div className="complete-order-summary">

            <span>
              총 {totalQuantity}개
            </span>

            <strong>
              {formatPrice(
                usedMileage
              )}
            </strong>

          </div>
        )}

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
            도착 인증을 해주세요. 인증 후
            대기번호가 발급되고 조리가
            시작됩니다.
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

        {isLoadingImage && (
          <div
            style={{
              display: 'none',
            }}
          >
            메뉴 이미지 불러오는 중
          </div>
        )}

      </div>

      {/* =====================================
          하단 영역
      ===================================== */}

      <div className="complete-bottom-area">

        <button
          type="button"
          className="complete-cancel-button"
          disabled={
            isCancelling
          }
          onClick={() => {
            setCancelError('')
            setShowCancelModal(
              true
            )
          }}
        >
          주문 취소
        </button>

        <div className="complete-bottom">

          <button
            type="button"
            className="complete-verify-button"
            onClick={
              handleVerify
            }
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
            if (
              !isCancelling
            ) {
              setShowCancelModal(
                false
              )
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
                결제한 마일리지가 100%
                환불됩니다.
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
              disabled={
                isCancelling
              }
              onClick={() =>
                setShowCancelModal(
                  false
                )
              }
            >
              계속 주문하기
            </button>

            <button
              type="button"
              className="cancel-confirm-button"
              disabled={
                isCancelling
              }
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

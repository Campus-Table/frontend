import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { getOrder } from '../api/orderApi'

import {
  attachImagesToOrder,
} from '../utils/orderImages'

// ========================================
// 서버 KST 시간 파싱
// ========================================

function parseServerTime(value) {
  if (!value) {
    return null
  }

  const normalized =
    value.slice(0, 19)

  const date =
    new Date(
      `${normalized}+09:00`
    )

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null
  }

  return date
}

// ========================================
// 가격 표시
// ========================================

function formatPrice(value) {
  const number =
    Number(value ?? 0)

  return `${number.toLocaleString(
    'ko-KR'
  )}원`
}

// ========================================
// 기존 주문 정보와
// 서버 최신 주문 데이터 합치기
//
// imageUrl이 있는 경우 잃어버리지 않도록 유지
// ========================================

function mergeOrderItems(
  previousOrder,
  newOrder
) {
  const previousItems =
    Array.isArray(previousOrder?.items)
      ? previousOrder.items
      : []

  const newItems =
    Array.isArray(newOrder?.items)
      ? newOrder.items
      : []

  const mergedItems =
    newItems.map(
      (newItem, index) => {
        const previousItem =
          previousItems.find(
            (item) =>
              Number(
                item.menuId ??
                  item.menu?.id ??
                  item.id
              ) ===
              Number(
                newItem.menuId ??
                  newItem.menu?.id ??
                  newItem.id
              )
          ) ??
          previousItems[index]

        return {
          ...previousItem,
          ...newItem,

          menuName:
            newItem.menuName ||
            newItem.name ||
            newItem.menu?.name ||
            previousItem?.menuName ||
            previousItem?.name ||
            previousItem?.menu?.name ||
            '메뉴 정보 없음',

          imageUrl:
            newItem.imageUrl ||
            newItem.image ||
            newItem.menuImageUrl ||
            newItem.menu?.imageUrl ||
            newItem.menu?.image ||
            previousItem?.imageUrl ||
            previousItem?.image ||
            previousItem?.menuImageUrl ||
            previousItem?.menu?.imageUrl ||
            previousItem?.menu?.image ||
            '',
        }
      }
    )

  // 서버 items가 없는 경우
  // 기존 items 유지
  return {
    ...previousOrder,
    ...newOrder,

    items:
      mergedItems.length > 0
        ? mergedItems
        : previousItems,

    storeName:
      newOrder?.storeName ||
      newOrder?.store?.name ||
      previousOrder?.storeName ||
      previousOrder?.store?.name ||
      '',
  }
}

function Waiting({
  order,
  onReady,
}) {
  // ========================================
  // 현재 주문 정보
  // ========================================

  const [
    currentOrder,
    setCurrentOrder,
  ] = useState(order)

  // ========================================
  // 화면용 남은 시간
  // ========================================

  const [
    remainingSeconds,
    setRemainingSeconds,
  ] = useState(
    Math.max(
      0,
      Number(
        order?.remainingSeconds ??
          0
      )
    )
  )

  // ========================================
  // API 상태
  // ========================================

  const [
    isLoading,
    setIsLoading,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  // ========================================
  // FoodReady 중복 이동 방지
  // ========================================

  const readyCalledRef =
    useRef(false)

  // ========================================
  // 주문 ID
  // ========================================

  const orderId =
    order?.orderId ??
    order?.id ??
    null

  // ========================================
  // 새 주문이 들어오면 초기화
  //
  // 처음 전달받은 order에도
  // 메뉴 이미지를 연결
  // ========================================

  useEffect(() => {
    let cancelled = false

    const initializeOrder =
      async () => {
        if (!order) {
          setCurrentOrder(order)
          return
        }

        try {
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
        } catch (imageError) {
          console.error(
            '초기 주문 이미지 연결 실패:',
            imageError
          )

          if (!cancelled) {
            setCurrentOrder(order)
          }
        }
      }

    initializeOrder()

    setRemainingSeconds(
      Math.max(
        0,
        Number(
          order?.remainingSeconds ??
            0
        )
      )
    )

    setError('')

    readyCalledRef.current =
      false

    return () => {
      cancelled = true
    }
  }, [order])

  // ========================================
  // 주문 상태 조회
  //
  // getOrder()에는 imageUrl이 없을 수 있으므로
  // attachImagesToOrder()를 이용해서
  // storeId → 메뉴 API → menuId 매칭으로
  // 실제 음식 이미지를 붙임
  // ========================================

  useEffect(() => {
    if (!orderId) {
      return
    }

    let cancelled = false

    const loadOrder =
      async (
        showLoading = false
      ) => {
        try {
          if (showLoading) {
            setIsLoading(true)
          }

          // ==================================
          // 1. 최신 주문 상태 조회
          // ==================================

          const result =
            await getOrder(
              orderId
            )

          // ==================================
          // 2. 주문에 실제 메뉴 이미지 연결
          //
          // result.storeId를 이용해서
          // /api/stores/{storeId}/menus 호출
          //
          // item.menuId와 menu.id를 비교해서
          // imageUrl 자동 연결
          // ==================================

          const orderWithImages =
            await attachImagesToOrder(
              result
            )

          if (cancelled) {
            return
          }

          // ==================================
          // 3. 기존 주문 데이터와 합침
          //
          // 서버 상태는 최신 상태로 갱신하고
          // imageUrl도 유지
          // ==================================

          setCurrentOrder(
            (previousOrder) =>
              mergeOrderItems(
                previousOrder,
                orderWithImages
              )
          )

          // ==================================
          // 남은 시간 갱신
          // ==================================

          if (
            typeof result
              ?.remainingSeconds ===
            'number'
          ) {
            setRemainingSeconds(
              Math.max(
                0,
                result.remainingSeconds
              )
            )
          } else {
            setRemainingSeconds(0)
          }

          setError('')
        } catch (apiError) {
          if (cancelled) {
            return
          }

          console.error(
            '주문 상태 조회 실패:',
            apiError
          )

          switch (
            apiError.code
          ) {
            case 'UNAUTHORIZED':
              setError(
                '로그인이 만료되었습니다. 다시 로그인해주세요.'
              )
              break

            case 'FORBIDDEN':
              setError(
                '이 주문에 접근할 수 없습니다.'
              )
              break

            case 'ORDER_NOT_FOUND':
              setError(
                '주문 정보를 찾을 수 없습니다.'
              )
              break

            case 'INVALID_REQUEST':
              setError(
                '잘못된 주문 정보입니다.'
              )
              break

            default:
              setError(
                apiError.message ||
                  '주문 상태를 불러오지 못했습니다.'
              )
          }
        } finally {
          if (
            !cancelled &&
            showLoading
          ) {
            setIsLoading(false)
          }
        }
      }

    // 화면 진입 즉시 조회
    loadOrder(true)

    // 7초마다 서버 상태 확인
    const pollingTimer =
      setInterval(() => {
        loadOrder(false)
      }, 7000)

    return () => {
      cancelled = true

      clearInterval(
        pollingTimer
      )
    }
  }, [orderId])

  // ========================================
  // RECEIVED가 되었을 때
  // FoodReady 화면으로 이동
  //
  // 이미지가 붙은 currentOrder를 전달
  // ========================================

  useEffect(() => {
    if (
      currentOrder?.status !==
        'RECEIVED' ||
      readyCalledRef.current
    ) {
      return
    }

    readyCalledRef.current =
      true

    onReady?.(
      currentOrder
    )
  }, [
    currentOrder,
    onReady,
  ])

  // ========================================
  // 화면용 1초 카운트다운
  // ========================================

  useEffect(() => {
    if (
      currentOrder?.status !==
      'COOKING'
    ) {
      return
    }

    const timer =
      setInterval(() => {
        setRemainingSeconds(
          (prev) => {
            if (prev <= 0) {
              return 0
            }

            return prev - 1
          }
        )
      }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [
    currentOrder?.status,
  ])

  // ========================================
  // 전체 예상 준비시간
  // ========================================

  const totalSeconds =
    useMemo(() => {
      const arrivedAt =
        parseServerTime(
          currentOrder?.arrivedAt
        )

      const expectedReadyAt =
        parseServerTime(
          currentOrder
            ?.expectedReadyAt
        )

      if (
        arrivedAt &&
        expectedReadyAt
      ) {
        const difference =
          Math.floor(
            (
              expectedReadyAt.getTime() -
              arrivedAt.getTime()
            ) / 1000
          )

        return Math.max(
          difference,
          1
        )
      }

      return Math.max(
        Number(
          currentOrder
            ?.remainingSeconds ??
            1
        ),
        1
      )
    }, [
      currentOrder?.arrivedAt,
      currentOrder
        ?.expectedReadyAt,
      currentOrder
        ?.remainingSeconds,
    ])

  // ========================================
  // 화면 시간 표시
  // ========================================

  const minutes =
    Math.floor(
      remainingSeconds / 60
    )

  const seconds =
    remainingSeconds % 60

  const formattedTime =
    `${minutes}:${seconds
      .toString()
      .padStart(2, '0')}`

  // ========================================
  // 예상 전체 대기시간
  // ========================================

  const estimatedMinutes =
    Math.max(
      1,
      Math.ceil(
        totalSeconds / 60
      )
    )

  // ========================================
  // 진행률
  // ========================================

  const progress =
    totalSeconds > 0
      ? (
          (
            totalSeconds -
            remainingSeconds
          ) /
          totalSeconds
        ) * 100
      : 100

  const normalizedProgress =
    Math.min(
      100,
      Math.max(
        progress,
        4
      )
    )

  // ========================================
  // 대기번호
  // ========================================

  const waitingNumber =
    currentOrder
      ?.waitingNumber != null
      ? String(
          currentOrder
            .waitingNumber
        ).padStart(
          3,
          '0'
        )
      : '---'

  // ========================================
  // 가게 정보
  // ========================================

  const storeName =
    currentOrder
      ?.storeName ??
    currentOrder
      ?.store?.name ??
    ''

  // ========================================
  // 주문 메뉴
  // ========================================

  const items =
    Array.isArray(
      currentOrder?.items
    )
      ? currentOrder.items
      : []

  const firstItem =
    items[0]

  const firstMenuName =
    firstItem?.menuName ??
    firstItem?.name ??
    firstItem?.menu?.name ??
    '메뉴 정보 없음'

  // ========================================
  // 첫 번째 메뉴 이미지
  // ========================================

  const firstMenuImage =
    firstItem?.imageUrl ||
    firstItem?.image ||
    firstItem?.menuImageUrl ||
    firstItem?.menu?.imageUrl ||
    firstItem?.menu?.image ||
    null

  // ========================================
  // 여러 메뉴 주문 표시
  // ========================================

  const menuDisplayName =
    items.length > 1
      ? `${firstMenuName} 외 ${
          items.length - 1
        }개`
      : firstMenuName

  // ========================================
  // 전체 수량
  // ========================================

  const totalQuantity =
    items.reduce(
      (
        sum,
        item
      ) =>
        sum +
        Number(
          item.quantity ?? 0
        ),
      0
    )

  // ========================================
  // 주문 없음
  // ========================================

  if (!order) {
    return (
      <div className="waiting-page">

        <header className="waiting-header">
          <h1>
            내 주문
          </h1>
        </header>

        <div className="waiting-empty">
          진행 중인 주문이 없습니다.
        </div>

      </div>
    )
  }

  // ========================================
  // orderId 없음
  // ========================================

  if (!orderId) {
    return (
      <div className="waiting-page">

        <header className="waiting-header">
          <h1>
            내 주문
          </h1>
        </header>

        <div className="waiting-empty">
          주문 정보를 불러오지 못했습니다.
        </div>

      </div>
    )
  }

  return (
    <div className="waiting-page">

      {/* =====================================
          상단 제목
      ===================================== */}

      <header className="waiting-header">

        <h1>
          내 주문
        </h1>

      </header>

      <main className="waiting-content">

        {/* =====================================
            오류
        ===================================== */}

        {error && (
          <div className="arrival-error-message">

            <span>
              !
            </span>

            <p>
              {error}
            </p>

          </div>
        )}

        {/* =====================================
            대기번호 / 시간 카드
        ===================================== */}

        <section className="waiting-status-card">

          <div className="waiting-status-top">

            <span>
              조리 중
              {storeName
                ? ` · ${storeName}`
                : ''}
            </span>

            <strong>
              도착 인증 완료
            </strong>

          </div>

          <div className="waiting-number">
            {waitingNumber}
          </div>

          <div className="waiting-number-label">
            나의 대기번호
          </div>

          <div className="waiting-status-divider" />

          <div className="waiting-time-row">

            <div>

              <span>
                음식 준비까지
              </span>

              <strong>
                예상 대기시간 약{' '}
                {estimatedMinutes}분
              </strong>

            </div>

            <div className="waiting-countdown">
              {formattedTime}
            </div>

          </div>

          <div className="waiting-progress">

            <div
              className="waiting-progress-bar"
              style={{
                width:
                  `${normalizedProgress}%`,
              }}
            />

          </div>

        </section>

        {/* =====================================
            시간 안내
        ===================================== */}

        <section className="waiting-info-card">

          <div className="waiting-info-icon">
            ◷
          </div>

          <div>

            <strong>
              표시된 시간은 음식 준비 완료 예상 시간이에요.
            </strong>

            <p>
              내 순서 호출까지의 시간이 아니며,
              시간이 지나면 자동으로 알려드려요.
            </p>

          </div>

        </section>

        {/* =====================================
            주문 메뉴
        ===================================== */}

        <section className="waiting-order-card">

          <div className="waiting-menu-image">

            {firstMenuImage ? (
              <img
                src={firstMenuImage}
                alt={firstMenuName}
              />
            ) : (
              '🍽️'
            )}

          </div>

          <div className="waiting-menu-info">

            <span className="waiting-store-name">
              {storeName}
            </span>

            <h2>
              {menuDisplayName}
            </h2>

            <div className="waiting-menu-bottom">

              <span>
                수량 {totalQuantity}개
              </span>

              <strong>
                {formatPrice(
                  currentOrder
                    ?.totalPrice
                )}
              </strong>

            </div>

          </div>

        </section>

        {/* =====================================
            진행 상태
        ===================================== */}

        <section className="waiting-timeline">

          <div className="waiting-timeline-item complete">

            <div className="waiting-timeline-left">

              <div className="waiting-timeline-circle">
                ✓
              </div>

              <div className="waiting-timeline-line" />

            </div>

            <div className="waiting-timeline-text">

              <strong>
                도착 인증 완료
              </strong>

              <span>
                완료
              </span>

            </div>

          </div>

          <div className="waiting-timeline-item active">

            <div className="waiting-timeline-left">

              <div className="waiting-timeline-dot">
                <span />
              </div>

            </div>

            <div className="waiting-timeline-text">

              <strong>
                음식을 준비하고 있어요
              </strong>

              <span>
                {remainingSeconds > 0
                  ? `예상 완료 약 ${Math.max(
                      1,
                      Math.ceil(
                        remainingSeconds /
                          60
                      )
                    )}분 후`
                  : '완료 여부 확인 중'}
              </span>

            </div>

          </div>

        </section>

        {isLoading && (
          <p className="waiting-loading">
            최신 주문 상태를 확인하고 있어요.
          </p>
        )}

      </main>

    </div>
  )
}

export default Waiting 

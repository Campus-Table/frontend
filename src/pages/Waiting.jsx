import { useEffect, useRef, useState } from 'react'
import { formatPrice } from '../data/mockData'

function Waiting({
  order,
  onReady,
}) {
  // ========================================
  // 프로토타입용 대기번호
  // ========================================
  const waitingNumber = 'A-013'

  // ========================================
  // 예상 준비시간
  // 8분 = 480초
  // ========================================
  const totalSeconds = 8 * 60

  const [remainingSeconds, setRemainingSeconds] =
    useState(totalSeconds)

  // ========================================
  // 완료 이벤트 중복 실행 방지
  // ========================================
  const readyCalledRef = useRef(false)

  // ========================================
  // 주문이 바뀌면 타이머 초기화
  // ========================================
  useEffect(() => {
    setRemainingSeconds(totalSeconds)
    readyCalledRef.current = false
  }, [order])

  // ========================================
  // 카운트다운
  // ========================================
  useEffect(() => {
    if (!order) {
      return
    }

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [order])

  // ========================================
  // 0초가 되면 음식 준비 완료 처리
  // ========================================
  useEffect(() => {
    if (!order) {
      return
    }

    if (
      remainingSeconds === 0 &&
      !readyCalledRef.current
    ) {
      readyCalledRef.current = true

      if (onReady) {
        onReady()
      }
    }
  }, [
    remainingSeconds,
    order,
    onReady,
  ])

  // ========================================
  // 시간 표시
  // ========================================
  const minutes =
    Math.floor(remainingSeconds / 60)

  const seconds =
    remainingSeconds % 60

  const formattedTime =
    `${minutes}:${seconds
      .toString()
      .padStart(2, '0')}`

  // ========================================
  // 진행률
  // ========================================
  const progress =
    ((totalSeconds - remainingSeconds) /
      totalSeconds) *
    100

  // ========================================
  // 주문 없음
  // ========================================
  if (!order) {
    return (
      <div className="waiting-page">

        <header className="waiting-header">
          <h1>내 주문</h1>
        </header>

        <div className="waiting-empty">
          진행 중인 주문이 없습니다.
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
        <h1>내 주문</h1>
      </header>

      <main className="waiting-content">

        {/* =====================================
            대기번호 / 시간 카드
        ===================================== */}
        <section className="waiting-status-card">

          <div className="waiting-status-top">

            <span>
              조리 중 · {order.storeName}
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
                예상 대기시간 약 8분
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
                width: `${Math.max(
                  progress,
                  4
                )}%`,
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
            🍽️
          </div>

          <div className="waiting-menu-info">

            <span className="waiting-store-name">
              {order.storeName}
            </span>

            <h2>
              {order.menuName}
            </h2>

            <div className="waiting-menu-bottom">

              <span>
                수량 1개
              </span>

              <strong>
                {formatPrice(order.price)}
              </strong>

            </div>

          </div>

        </section>

        {/* =====================================
            진행 상태
        ===================================== */}
        <section className="waiting-timeline">

          {/* 도착 인증 완료 */}
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
                방금
              </span>

            </div>

          </div>

          {/* 음식 준비 중 */}
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
                        remainingSeconds / 60
                      )
                    )}분 후`
                  : '준비 완료'}
              </span>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}

export default Waiting 

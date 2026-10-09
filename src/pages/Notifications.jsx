function Notifications({
  order,
  orderStatus,
}) {
  // ========================================
  // 주문 정보
  // ========================================
  const storeName =
    order?.storeName || '가게'

  const menuName =
    order?.menuName ||
    order?.name ||
    '메뉴'

  // ========================================
  // 주문 상태 확인
  // ========================================
  const isWaiting =
    orderStatus === 'waiting'

  const isReady =
    orderStatus === 'ready'

  const isPaid =
    orderStatus === 'paid'

  return (
    <div className="notifications-page">

      {/* =====================================
          상단
      ===================================== */}
      <header className="notifications-header">

        <h1>
          알림
        </h1>

        <p>
          주문 소식을 빠르게 확인하세요.
        </p>

      </header>

      <main className="notifications-content">

        {/* =====================================
            음식 준비 완료

            타이머가 0:00이 되어
            orderStatus가 ready가 된 경우에만 표시
        ===================================== */}
        {order && isReady && (
          <section className="notification-card notification-card-primary">

            <div className="notification-icon primary-icon">
              ♧
            </div>

            <div className="notification-body">

              <div className="notification-title-row">

                <strong>
                  음식을 수령하러 와주세요
                </strong>

                <span>
                  방금
                </span>

              </div>

              <p>
                예상 준비시간이 지났습니다.{' '}
                {storeName} 수령대로 와주세요.
              </p>

            </div>

          </section>
        )}

        {/* =====================================
            음식 조리 시작

            waiting 상태에서도 표시
            ready가 되어도 이전 알림이므로 유지
        ===================================== */}
        {order && (isWaiting || isReady) && (
          <section className="notification-card">

            <div className="notification-icon">
              ◷
            </div>

            <div className="notification-body">

              <div className="notification-title-row">

                <strong>
                  음식 조리가 시작되었습니다
                </strong>

                <span>
                  {isReady
                    ? '8분 전'
                    : '방금'}
                </span>

              </div>

              <p>
                예상 준비시간은 약 8분입니다.
              </p>

            </div>

          </section>
        )}

        {/* =====================================
            대기번호 발급

            waiting / ready 상태에서 표시
        ===================================== */}
        {order && (isWaiting || isReady) && (
          <section className="notification-card">

            <div className="notification-icon">
              ▣
            </div>

            <div className="notification-body">

              <div className="notification-title-row">

                <strong>
                  대기번호 A-013이 발급되었습니다
                </strong>

                <span>
                  {isReady
                    ? '8분 전'
                    : '방금'}
                </span>

              </div>

              <p>
                도착 인증이 완료되어
                대기번호가 발급됐어요.
              </p>

            </div>

          </section>
        )}

        {/* =====================================
            선주문 완료

            결제 완료 이후 항상 표시
        ===================================== */}
        {order && (
          <section className="notification-card">

            <div className="notification-icon">
              ✓
            </div>

            <div className="notification-body">

              <div className="notification-title-row">

                <strong>
                  선주문이 완료되었습니다
                </strong>

                <span>
                  {isReady
                    ? '22분 전'
                    : isWaiting
                      ? '14분 전'
                      : isPaid
                        ? '방금'
                        : '방금'}
                </span>

              </div>

              <p>
                {storeName} {menuName} 결제가 완료됐어요.
              </p>

            </div>

          </section>
        )}

        {/* =====================================
            주문 없음
        ===================================== */}
        {!order && (
          <div className="notification-empty">

            <div className="notification-empty-icon">
              ♧
            </div>

            <strong>
              아직 알림이 없어요
            </strong>

            <p>
              주문을 시작하면 진행 상황을
              알려드릴게요.
            </p>

          </div>
        )}

      </main>

    </div>
  )
}

export default Notifications  


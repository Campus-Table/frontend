function FoodReady({
  order,
  onHome,
}) {
  // ========================================
  // 주문 정보 없음
  // ========================================
  if (!order) {
    return (
      <main className="food-ready-page">

        <div className="food-ready-empty">
          주문 정보를 불러올 수 없습니다.
        </div>

      </main>
    )
  }

  // ========================================
  // 가게 이름
  // ========================================
  const storeName =
    order.storeName ??
    '가게'

  // ========================================
  // 서버 대기번호
  //
  // 서버:
  // 2
  //
  // 화면:
  // 002
  // ========================================
  const waitingNumber =
    order.waitingNumber != null
      ? String(
          order.waitingNumber
        ).padStart(
          3,
          '0'
        )
      : '---'

  // ========================================
  // 주문 메뉴
  // ========================================
  const items =
    Array.isArray(
      order.items
    )
      ? order.items
      : []

  const firstItem =
    items[0]

  const firstMenuName =
    firstItem?.menuName ??
    '주문 메뉴'

  // ========================================
  // 여러 메뉴일 경우
  //
  // 제육볶음 외 2개
  // ========================================
  const menuDisplayName =
    items.length > 1
      ? `${firstMenuName} 외 ${
          items.length - 1
        }개`
      : firstMenuName

  return (
    <main className="food-ready-page">

      <div className="food-ready-content">

        {/* =====================================
            준비 완료 아이콘
        ===================================== */}
        <section className="food-ready-message">

        <div className="food-ready-icon-wrap">
          <div className="food-ready-icon">
            <svg
              viewBox="0 0 24 24"
              width="34"
              height="34"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M10 21h4" />
            </svg>
          </div>
        </div>

          <span className="food-ready-label">
            READY TO PICK UP
          </span>

          <h1>
            음식이 나왔어요!
          </h1>

          <p>
            주문하신 음식이 준비되었어요.
            <br />
            가게 수령대로 와주세요.
          </p>

        </section>

        {/* =====================================
            대기번호 카드
        ===================================== */}
        <section className="food-ready-number-card">

          <strong className="food-ready-store">
            {storeName}
          </strong>

          <span className="food-ready-number-label">
            대기번호
          </span>

          <div className="food-ready-number">

            {waitingNumber}

            <span>
              번
            </span>

          </div>

          <div className="food-ready-divider" />

          <div className="food-ready-menu">

            <span>
              메뉴
            </span>

            <strong>
              {menuDisplayName}
            </strong>

          </div>

        </section>

        {/* =====================================
            수령 안내
        ===================================== */}
        <div className="food-ready-guide">

          {storeName} 수령대에서
          대기번호 {waitingNumber}번을
          확인해주세요.

        </div>

        {/* =====================================
            홈으로
        ===================================== */}
        <button
          type="button"
          className="food-ready-home-button"
          onClick={onHome}
        >
          홈으로 돌아가기
        </button>

      </div>

    </main>
  )
}

export default FoodReady
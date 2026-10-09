function FoodReady({
  order,
  waitingNumber = 'A-013',
  onHome,
}) {
  if (!order) {
    return (
      <main className="food-ready-page">
        <div className="food-ready-empty">
          주문 정보를 불러올 수 없습니다.
        </div>
      </main>
    )
  }

  const storeName =
    order.storeName || '경성카츠'

  const menuName =
    order.menuName ||
    order.name ||
    '선택 메뉴'

  return (
    <main className="food-ready-page">

      <div className="food-ready-content">

        {/* =====================================
            준비 완료 아이콘
        ===================================== */}
        <section className="food-ready-message">

          <div className="food-ready-icon-wrap">
            <div className="food-ready-icon">
              ♧
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
            {waitingNumber.replace('A-', '')}
            <span>번</span>
          </div>

          <div className="food-ready-divider" />

          <div className="food-ready-menu">

            <span>
              메뉴
            </span>

            <strong>
              {menuName}
            </strong>

          </div>

        </section>

        {/* =====================================
            수령 안내
        ===================================== */}
        <div className="food-ready-guide">
          {storeName} 수령대에서 대기번호를 보여주세요.
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

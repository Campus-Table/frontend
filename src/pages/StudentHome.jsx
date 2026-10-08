function StudentHome({ onStore, onOrders, onNotifications }) {
  const stores = [
    {
      id: 'popo420',
      category: '든든한 덮밥',
      name: '포포420',
      menu: '불고기 마요 덮밥',
      price: '5,900원~',
      emoji: '🍚',
    },
    {
      id: 'gapjjigae',
      category: '따뜻한 한식',
      name: '값찌개',
      menu: '돼지 김치찌개',
      price: '6,000원~',
      emoji: '🍲',
    },
    {
      id: 'gyeongseong',
      category: '바삭한 한 끼',
      name: '경성카츠',
      menu: '등심카츠',
      price: '6,500원~',
      emoji: '🍛',
    },
    {
      id: 'bibigogo',
      category: '가볍고 맛있게',
      name: '비비고고',
      menu: '비빔밥',
      price: '5,500원~',
      emoji: '🥗',
    },
  ]

  return (
    <main className="student-home">

      {/* 상단 Campus Table */}
      <header className="student-header">
        <div className="student-brand">
          <div className="student-brand-icon">♙</div>
          <h1>Campus Table</h1>
        </div>

        <button
          className="header-notification"
          onClick={onNotifications}
          aria-label="알림"
        >
          ♧
          <span className="notification-dot"></span>
        </button>
      </header>

      {/* 전체 혼잡도 */}
      <section className="crowd-section">

        <div className="crowd-top">
          <div>
            <p className="crowd-small">
              학생식당 실시간 현황
            </p>

            <div className="crowd-status">
              <span className="crowd-red-dot"></span>
              <strong>현재 혼잡</strong>
            </div>
          </div>

          <span className="update-badge">
            방금 업데이트
          </span>
        </div>

        <div className="crowd-divider"></div>

        <div className="crowd-bottom">
          <div>
            <p>현재 이용 인원</p>
            <span>좌석 120석 기준</span>
          </div>

          <div className="crowd-number">
            87<span>명</span>
          </div>
        </div>

      </section>

      <div className="auto-update">
        ⓘ &nbsp; 이용 인원과 혼잡도는 자동으로 갱신돼요.
      </div>

      {/* 가게 목록 */}
      <section className="store-section">

        <div className="store-section-header">
          <div>
            <p className="section-label">STORES</p>
            <h2>오늘은 어디서 먹을까요?</h2>
          </div>

          <span className="store-count">
            4개 가게
          </span>
        </div>

        <div className="store-grid">
          {stores.map((store) => (
            <button
              key={store.id}
              className="store-card"
              onClick={() => onStore?.(store.id)}
            >
              <div className={`store-image ${store.id}`}>
                <span>{store.emoji}</span>
              </div>

              <div className="store-info">
                <p className="store-category">
                  {store.category}
                </p>

                <h3>{store.name}</h3>

                <p className="store-menu">
                  {store.menu}
                </p>

                <strong className="store-price">
                  {store.price}
                </strong>
              </div>
            </button>
          ))}
        </div>

      </section>

      {/* 하단 네비게이션 */}
      <nav className="student-bottom-nav">

        <button className="nav-item active">
          <span className="nav-icon">⌂</span>
          <span>홈</span>
        </button>

        <button
          className="nav-item"
          onClick={onOrders}
        >
          <span className="nav-icon">▤</span>
          <span>내 주문</span>
        </button>

        <button
          className="nav-item"
          onClick={onNotifications}
        >
          <span className="nav-icon">♧</span>
          <span>알림</span>
        </button>

      </nav>

    </main>
  )
}

export default StudentHome
const stores = [
  {
    id: "51jang",
    name: "51장국밥",
    category: "든든한 국밥과 한식 메뉴",
    menu: "고기만국밥",
    price: "1,000원~",
    emoji: "🍚",
  },
  {
    id: "gaosung",
    name: "가오슝",
    category: "다양한 덮밥과 면 요리",
    menu: "갈비튀김덮밥",
    price: "5,900원~",
    emoji: "🍜",
  },
  {
    id: "gapjjigae",
    name: "값찌개",
    category: "따뜻하고 든든한 찌개",
    menu: "공기밥",
    price: "1,000원~",
    emoji: "🍲",
  },
  {
    id: "gyeongseong",
    name: "경성카츠",
    category: "바삭한 한 끼",
    menu: "고구마치즈돈카츠",
    price: "4,900원~",
    emoji: "🍱",
  },
  {
    id: "gwangttuk",
    name: "광뚝",
    category: "불고기와 뚝배기 한식",
    menu: "물만두",
    price: "1,900원~",
    emoji: "🥘",
  },
  {
    id: "tokyoya",
    name: "도쿄야",
    category: "오므라이스와 함박스테이크",
    menu: "음료",
    price: "0원~",
    emoji: "🍛",
  },
  {
    id: "babideundeun",
    name: "바비든든",
    category: "든든한 덮밥 한 끼",
    menu: "고기든든",
    price: "3,900원~",
    emoji: "🍖",
  },
  {
    id: "bibigogo",
    name: "비비고고",
    category: "카레와 비빔밥",
    menu: "기본카레",
    price: "4,900원~",
    emoji: "🍛",
  },
  {
    id: "pokpung",
    name: "폭풍분식",
    category: "라면·김밥·분식",
    menu: "폭풍라면",
    price: "3,500원~",
    emoji: "🍜",
  },
];

function StudentHome({ onStore, onOrders, onNotifications }) {

  const handleStoreClick = (storeId) => {
    if (onStore) {
      onStore(storeId);
    }
  };

  return (
    <div className="student-home">

      {/* 상단 Campus Table */}
      <header className="student-header">
        <div className="student-brand">
          <div className="student-brand-icon">♙</div>
          <h1>Campus Table</h1>
        </div>

        <button
          className="header-notification"
          onClick={onNotifications}
        >
          ♧
          <span className="notification-dot"></span>
        </button>
      </header>

      {/* 혼잡도 */}
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

          <strong className="crowd-number">
            87<span>명</span>
          </strong>
        </div>
      </section>

      {/* 자동 업데이트 안내 */}
      <div className="auto-update">
        ⓘ &nbsp; 이용 인원과 혼잡도는 자동으로 갱신돼요.
      </div>

      {/* 식당 목록 */}
      <section className="store-section">

        <div className="store-section-header">
          <div>
            <p className="section-label">STORES</p>
            <h2>오늘은 어디서 먹을까요?</h2>
          </div>

          <span className="store-count">
            {stores.length}개 가게
          </span>
        </div>

        <div className="store-grid">
          {stores.map((store) => (
            <button
              key={store.id}
              type="button"
              className="store-card"
              onClick={() => handleStoreClick(store.id)}
            >
              <div className="store-image">
                {store.emoji}
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

      {/* 하단 메뉴 */}
      <nav className="student-bottom-nav">

        <button
          type="button"
          className="nav-item active"
        >
          <span className="nav-icon">⌂</span>
          <span>홈</span>
        </button>

        <button
          type="button"
          className="nav-item"
          onClick={onOrders}
        >
          <span className="nav-icon">▤</span>
          <span>내 주문</span>
        </button>

        <button
          type="button"
          className="nav-item"
          onClick={onNotifications}
        >
          <span className="nav-icon">♧</span>
          <span>알림</span>
        </button>

      </nav>

    </div>
  );
}

export default StudentHome;
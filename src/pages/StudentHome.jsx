import { stores, formatPrice } from '../data/mockData'

const storeEmojis = {
  '51jang': '🍚',
  gaosung: '🍜',
  gapjjigae: '🍲',
  gyeongseong: '🍱',
  gwangttuk: '🥘',
  tokyoya: '🍛',
  babideundeun: '🍖',
  bibigogo: '🍛',
  pokpung: '🍜',
}

function StudentHome({ onStore, onOrders, onNotifications }) {
  const handleStoreClick = (storeId) => {
    if (onStore) {
      onStore(storeId)
    }
  }

  const getLowestPrice = (menus) => {
    if (!menus || menus.length === 0) {
      return '가격 정보 없음'
    }

    const prices = menus.map((menu) => menu.price)
    const lowestPrice = Math.min(...prices)

    return `${formatPrice(lowestPrice)}~`
  }

  return (
    <div className="student-home">

      <header className="student-header">
        <div className="student-brand">
          <div className="student-brand-icon">♙</div>
          <h1>Campus Table</h1>
        </div>

        <button
          type="button"
          className="header-notification"
          onClick={onNotifications}
        >
          ♧
          <span className="notification-dot"></span>
        </button>
      </header>

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

      <div className="auto-update">
        ⓘ &nbsp; 이용 인원과 혼잡도는 자동으로 갱신돼요.
      </div>

      <section className="store-section">

        <div className="store-section-header">
          <div>
            <p className="section-label">
              STORES
            </p>

            <h2>
              오늘은 어디서 먹을까요?
            </h2>
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
                {storeEmojis[store.id] || '🍽️'}
              </div>

              <div className="store-info">
                <p className="store-category">
                  {store.description}
                </p>

                <h3>{store.name}</h3>

                <p className="store-menu">
                  {store.menus[0]?.name}
                </p>

                <strong className="store-price">
                  {getLowestPrice(store.menus)}
                </strong>
              </div>
            </button>
          ))}

        </div>
      </section>

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
  )
}

export default StudentHome
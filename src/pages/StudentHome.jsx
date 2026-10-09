import { stores, formatPrice } from '../data/mockData'

// ======================================================
// 가게별 임시 이미지/아이콘
// 나중에 서버에서 imageUrl을 받으면 제거할 예정
// ======================================================
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

function StudentHome({
  onStore,
  onOrders,
  onNotifications,
}) {
  // ======================================================
  // 가게 클릭
  // ======================================================

  const handleStoreClick = (storeId) => {
    if (onStore) {
      onStore(storeId)
    }
  }

  // ======================================================
  // 가게 메뉴 중 가장 저렴한 가격
  // ======================================================

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

      {/* ==================================================
          상단 헤더
      ================================================== */}

      <header className="student-header">

        <div className="student-brand">
          <div className="student-brand-icon">
            ♙
          </div>

          <h1>Campus Table</h1>
        </div>

        <button
          type="button"
          className="header-notification"
          onClick={onNotifications}
          aria-label="알림"
        >
          ♧

          <span className="notification-dot"></span>
        </button>

      </header>

      {/* ==================================================
          학생식당 실시간 혼잡도
      ================================================== */}

      <section className="crowd-section">

        {/* 상단 */}

        <div className="crowd-top">

          <div>
            <p className="crowd-small">
              학생식당 실시간 현황
            </p>

            <div className="crowd-status">
              <span className="crowd-red-dot"></span>

              <strong>
                현재 매우 혼잡
              </strong>
            </div>
          </div>

          <span className="update-badge">
            방금 업데이트
          </span>

        </div>

        {/* 구분선 */}

        <div className="crowd-divider"></div>

        {/* 현재 인원 */}

        <div className="crowd-bottom">

          <div>
            <p>현재 이용 인원</p>

            <span>
              좌석 120석 기준
            </span>
          </div>

          <strong className="crowd-number">
            87
            <span>명</span>
          </strong>

        </div>

        {/* 혼잡 안내 */}

        <div className="crowd-warning">
          현재 매우 혼잡해요. 도착하면 자리가 없을 수 있어요.
        </div>

      </section>

      {/* ==================================================
          자동 업데이트 안내
      ================================================== */}

      <div className="auto-update">
        <span className="auto-update-icon">
          ⓘ
        </span>

        <span>
          이용 인원과 혼잡도는 자동으로 갱신돼요.
        </span>
      </div>

      {/* ==================================================
          가게 목록
      ================================================== */}

      <section className="store-section">

        {/* 제목 */}

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

        {/* 가게 카드 */}

        <div className="store-grid">

          {stores.map((store) => (

            <button
              key={store.id}
              type="button"
              className="store-card"
              onClick={() =>
                handleStoreClick(store.id)
              }
            >

              {/* 가게 이미지 */}

              <div className="store-image">
                {storeEmojis[store.id] || '🍽️'}
              </div>

              {/* 가게 정보 */}

              <div className="store-info">

                <p className="store-category">
                  {store.description}
                </p>

                <h3>
                  {store.name}
                </h3>

                <p className="store-menu">
                  {store.menus?.[0]?.name ||
                    '메뉴 준비 중'}
                </p>

                <strong className="store-price">
                  {getLowestPrice(store.menus)}
                </strong>

              </div>

            </button>

          ))}

        </div>

      </section>

      {/* ==================================================
          하단 네비게이션

          App.jsx의 BottomNav를 사용하고 있으므로
          여기에는 별도의 nav를 만들지 않음.
      ================================================== */}

    </div>
  )
}

export default StudentHome   
import { getStoreById, formatPrice } from '../data/mockData'

function StoreDetail({
  storeId,
  onBack,
  onOrder,
}) {
  const store = getStoreById(storeId)

  if (!store) {
    return (
      <div className="store-detail-page">
        <button onClick={onBack}>←</button>
        <h2>가게를 찾을 수 없습니다.</h2>
      </div>
    )
  }

  return (
    <div className="store-detail-page">
      {/* 상단 */}
      <header className="store-detail-header">
        <button
          type="button"
          className="back-button"
          onClick={onBack}
        >
          ‹
        </button>

        <h2>{store.name}</h2>

        <div className="header-space"></div>
      </header>

      {/* 가게 대표 영역 */}
      <section className="store-hero">
        <div className="store-hero-icon">
          🍽️
        </div>

        <div className="store-hero-text">
          <span>{store.description}</span>
          <h1>{store.name}</h1>
        </div>
      </section>

      {/* 메뉴 */}
      <section className="menu-section">
        <div className="menu-section-title">
          <h2>메뉴를 선택해주세요</h2>
          <span>{store.menus.length}개 메뉴</span>
        </div>

        <div className="menu-list">
          {store.menus.map((menu) => (
            <button
              type="button"
              key={menu.id}
              className="menu-card"
              onClick={() => onOrder(store.id, menu.id)}
            >
              <div className="menu-image-placeholder">
                🍽️
              </div>

              <div className="menu-info">
                <h3>{menu.name}</h3>

                <strong>
                  {formatPrice(menu.price)}
                </strong>
              </div>

              <div className="menu-select-circle">
                ›
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

export default StoreDetail
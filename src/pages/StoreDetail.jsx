import { useState } from 'react'
import { getStoreById, formatPrice } from '../data/mockData'

function StoreDetail({ storeId, onBack, onOrder }) {
  const store = getStoreById(storeId)

  const [selectedMenuId, setSelectedMenuId] = useState(null)

  if (!store) {
    return (
      <div className="store-detail-page">
        <button
          type="button"
          className="back-button"
          onClick={onBack}
        >
          ‹
        </button>

        <h2>가게를 찾을 수 없습니다.</h2>
      </div>
    )
  }

  const selectedMenu =
    store.menus.find((menu) => menu.id === selectedMenuId) || null

  const handleOrder = () => {
    if (!selectedMenu) return

    if (onOrder) {
      onOrder({
        storeId: store.id,
        storeName: store.name,
        menuId: selectedMenu.id,
        menuName: selectedMenu.name,
        price: selectedMenu.price,
      })
    }
  }

  return (
    <div className="store-detail-page">

      {/* 상단 헤더 */}
      <header className="store-detail-header">
        <button
          type="button"
          className="back-button"
          onClick={onBack}
          aria-label="뒤로가기"
        >
          ‹
        </button>

        <h2>{store.name}</h2>

        <div className="header-space" />
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

      {/* 메뉴 영역 */}
      <section className="menu-section">

        <div className="menu-section-title">
          <h2>메뉴를 선택해주세요</h2>
          <span>단일 선택</span>
        </div>

        <div className="menu-list">

          {store.menus.map((menu) => {
            const isSelected = selectedMenuId === menu.id

            return (
              <button
                type="button"
                key={menu.id}
                className={`menu-card ${
                  isSelected ? 'selected' : ''
                }`}
                onClick={() => setSelectedMenuId(menu.id)}
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

                <div
                  className={`menu-select-circle ${
                    isSelected ? 'selected' : ''
                  }`}
                >
                  {isSelected ? '✓' : ''}
                </div>

              </button>
            )
          })}

        </div>

        {/* 선주문 버튼 */}
        <div className="store-order-bottom">

          <button
            type="button"
            className="preorder-button"
            disabled={!selectedMenu}
            onClick={handleOrder}
          >
            <span className="preorder-text">
              선주문하기
            </span>

            <span className="preorder-arrow">
              ›
            </span>
          </button>

        </div>

      </section>

    </div>
  )
}

export default StoreDetail
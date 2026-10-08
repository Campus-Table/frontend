import { useState } from 'react'

function StoreDetail({ storeId, onBack, onOrder }) {
  const [selectedMenu, setSelectedMenu] = useState('pork-cutlet')

  const menus = [
    {
      id: 'pork-cutlet',
      name: '경성 등심카츠',
      description: '두툼한 등심과 수제 소스',
      price: 6500,
      emoji: '🍛',
    },
    {
      id: 'cheese-cutlet',
      name: '치즈 카츠',
      description: '고소한 모짜렐라 치즈',
      price: 7200,
      emoji: '🧀',
    },
    {
      id: 'katsudon',
      name: '카츠동',
      description: '부드러운 달걀 카츠 덮밥',
      price: 6800,
      emoji: '🍚',
    },
  ]

  const selected = menus.find((menu) => menu.id === selectedMenu)

  return (
    <main className="store-detail-page">

      {/* 상단 */}
      <header className="store-detail-header">
        <button
          className="store-detail-back"
          onClick={onBack}
          aria-label="뒤로가기"
        >
          ‹
        </button>

        <h1>경성카츠</h1>

        <div className="header-space"></div>
      </header>

      {/* 가게 대표 이미지 */}
      <section className="store-hero">
        <div className="store-hero-placeholder">
          🍛
        </div>

        <div className="store-hero-text">
          <p>바삭한 한 끼</p>
          <h2>경성카츠</h2>
        </div>
      </section>

      {/* 메뉴 선택 */}
      <section className="menu-section">

        <div className="menu-section-title">
          <h2>메뉴를 선택해주세요</h2>
          <span>단일 선택</span>
        </div>

        <div className="menu-list">
          {menus.map((menu) => {
            const isSelected = selectedMenu === menu.id

            return (
              <button
                key={menu.id}
                className={`menu-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedMenu(menu.id)}
              >
                <div className="menu-image">
                  {menu.emoji}
                </div>

                <div className="menu-content">
                  <h3>{menu.name}</h3>

                  <p>{menu.description}</p>

                  <strong>
                    {menu.price.toLocaleString()}원
                  </strong>
                </div>

                <div
                  className={`menu-radio ${
                    isSelected ? 'selected' : ''
                  }`}
                >
                  {isSelected && '✓'}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* 하단 주문 버튼 */}
      <div className="store-order-bottom">
        <button
          className="preorder-button"
          onClick={() => onOrder?.(selected)}
        >
          선주문하기
          <span>›</span>
        </button>
      </div>

    </main>
  )
}

export default StoreDetail
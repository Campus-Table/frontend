import { useEffect, useState } from 'react'

import {
  getStore,
  getStoreMenus,
} from '../api/storeApi'

function StoreDetail({
  storeId,
  onBack,
  onOrder,
}) {
  const [store, setStore] = useState(null)
  const [menus, setMenus] = useState([])

  const [
    selectedMenuId,
    setSelectedMenuId,
  ] = useState(null)

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  // ======================================================
  // 가게 상세 + 메뉴 조회
  // ======================================================

  useEffect(() => {
    let cancelled = false

    const loadStore = async () => {
      try {
        setIsLoading(true)
        setError('')
        setSelectedMenuId(null)

        const [
          storeData,
          menuData,
        ] = await Promise.all([
          getStore(storeId),
          getStoreMenus(storeId),
        ])

        if (cancelled) {
          return
        }

        setStore(storeData)

        setMenus(
          Array.isArray(menuData)
            ? menuData
            : []
        )
      } catch (error) {
        if (cancelled) {
          return
        }

        console.error(
          '가게 정보 조회 실패:',
          error
        )

        if (
          error.code ===
          'STORE_NOT_FOUND'
        ) {
          setError(
            '가게를 찾을 수 없습니다.'
          )
        } else if (
          error.code ===
          'UNAUTHORIZED'
        ) {
          setError(
            '로그인이 필요합니다.'
          )
        } else {
          setError(
            error.message ||
              '가게 정보를 불러오지 못했습니다.'
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    if (storeId) {
      loadStore()
    } else {
      setError(
        '가게 정보가 없습니다.'
      )

      setIsLoading(false)
    }

    return () => {
      cancelled = true
    }
  }, [storeId])

  // ======================================================
  // 선택된 메뉴
  // ======================================================

  const selectedMenu =
    menus.find(
      (menu) =>
        menu.id === selectedMenuId
    ) || null

  // ======================================================
  // 가격 표시
  // ======================================================

  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined
    ) {
      return '가격 정보 없음'
    }

    return `${Number(
      price
    ).toLocaleString('ko-KR')}원`
  }

  // ======================================================
  // 메뉴 선택
  // ======================================================

  const handleMenuSelect = (menu) => {
    if (!menu.available) {
      return
    }

    setSelectedMenuId(menu.id)
  }

  // ======================================================
  // 선주문
  // ======================================================

  const handleOrder = () => {
    if (!store || !selectedMenu) {
      return
    }

    if (!selectedMenu.available) {
      return
    }

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

  // ======================================================
  // 로딩
  // ======================================================

  if (isLoading) {
    return (
      <div className="store-detail-page">

        <header className="store-detail-header">

          <button
            type="button"
            className="back-button"
            onClick={onBack}
            aria-label="뒤로가기"
          >
            ‹
          </button>

          <h2>가게 정보</h2>

          <div className="header-space" />

        </header>

        <div className="auto-update">
          <span className="auto-update-icon">
            ⓘ
          </span>

          <span>
            가게 정보를 불러오는 중이에요.
          </span>
        </div>

      </div>
    )
  }

  // ======================================================
  // 오류
  // ======================================================

  if (error || !store) {
    return (
      <div className="store-detail-page">

        <header className="store-detail-header">

          <button
            type="button"
            className="back-button"
            onClick={onBack}
            aria-label="뒤로가기"
          >
            ‹
          </button>

          <h2>가게 정보</h2>

          <div className="header-space" />

        </header>

        <div className="auto-update">
          <span className="auto-update-icon">
            ⓘ
          </span>

          <span>
            {error ||
              '가게를 찾을 수 없습니다.'}
          </span>
        </div>

      </div>
    )
  }

  return (
    <div className="store-detail-page">

      {/* ==================================================
          상단 헤더
      ================================================== */}

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

      {/* ==================================================
          가게 대표 영역
      ================================================== */}

      <section className="store-hero">

        <div className="store-hero-icon">

          {store.imageUrl ? (
            <img
              src={store.imageUrl}
              alt={store.name}
            />
          ) : (
            '🍽️'
          )}

        </div>

        <div className="store-hero-text">

          <span>
            {store.description ||
              store.category ||
              '학생식당'}
          </span>

          <h1>
            {store.name}
          </h1>

        </div>

      </section>

      {/* ==================================================
          메뉴 영역
      ================================================== */}

      <section className="menu-section">

        <div className="menu-section-title">

          <h2>
            메뉴를 선택해주세요
          </h2>

          <span>
            단일 선택
          </span>

        </div>

        <div className="menu-list">

          {menus.map((menu) => {
            const isSelected =
              selectedMenuId === menu.id

            const isAvailable =
              menu.available !== false

            return (
              <button
                type="button"
                key={menu.id}
                className={`menu-card ${
                  isSelected
                    ? 'selected'
                    : ''
                }`}
                disabled={!isAvailable}
                onClick={() =>
                  handleMenuSelect(menu)
                }
              >

                {/* 메뉴 이미지 */}

                <div className="menu-image-placeholder">

                  {menu.imageUrl ? (
                    <img
                      src={menu.imageUrl}
                      alt={menu.name}
                    />
                  ) : (
                    '🍽️'
                  )}

                </div>

                {/* 메뉴 정보 */}

                <div className="menu-info">

                  <h3>
                    {menu.name}
                  </h3>

                  <strong>
                    {formatPrice(
                      menu.price
                    )}
                  </strong>

                  {!isAvailable && (
                    <span>
                      품절
                    </span>
                  )}

                </div>

                {/* 선택 표시 */}

                <div
                  className={`menu-select-circle ${
                    isSelected
                      ? 'selected'
                      : ''
                  }`}
                >
                  {isSelected
                    ? '✓'
                    : ''}
                </div>

              </button>
            )
          })}

          {menus.length === 0 && (
            <div className="auto-update">

              <span className="auto-update-icon">
                ⓘ
              </span>

              <span>
                현재 등록된 메뉴가 없습니다.
              </span>

            </div>
          )}

        </div>

        {/* ==================================================
            선주문 버튼
        ================================================== */}

        <div className="store-order-bottom">

          <button
            type="button"
            className="preorder-button"
            disabled={
              !selectedMenu ||
              selectedMenu.available === false
            }
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


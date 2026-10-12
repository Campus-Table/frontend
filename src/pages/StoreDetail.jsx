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

  // ======================================================
  // 메뉴별 선택 수량
  // 예: { 1: 2, 3: 1 }
  // ======================================================

  const [
    menuQuantities,
    setMenuQuantities,
  ] = useState({})

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
        setMenuQuantities({})

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
  // 선택된 메뉴 목록
  // ======================================================

  const selectedMenus =
    menus
      .filter(
        (menu) =>
          (menuQuantities[menu.id] || 0) >
          0
      )
      .map((menu) => ({
        ...menu,
        quantity:
          menuQuantities[menu.id] || 0,
      }))

  // ======================================================
  // 총 선택 수량
  // ======================================================

  const totalQuantity =
    selectedMenus.reduce(
      (sum, menu) =>
        sum + menu.quantity,
      0
    )

  // ======================================================
  // 총 주문 금액
  // ======================================================

  const totalPrice =
    selectedMenus.reduce(
      (sum, menu) =>
        sum +
        Number(menu.price || 0) *
          menu.quantity,
      0
    )

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
  // 수량 증가
  // ======================================================

  const handleIncrease = (
    event,
    menu
  ) => {
    event.stopPropagation()

    if (menu.available === false) {
      return
    }

    setMenuQuantities(
      (previous) => ({
        ...previous,

        [menu.id]:
          (previous[menu.id] || 0) + 1,
      })
    )
  }

  // ======================================================
  // 수량 감소
  // ======================================================

  const handleDecrease = (
    event,
    menu
  ) => {
    event.stopPropagation()

    if (menu.available === false) {
      return
    }

    setMenuQuantities((previous) => {
      const currentQuantity =
        previous[menu.id] || 0

      if (currentQuantity <= 0) {
        return previous
      }

      const nextQuantity =
        currentQuantity - 1

      const next = {
        ...previous,
      }

      if (nextQuantity === 0) {
        delete next[menu.id]
      } else {
        next[menu.id] =
          nextQuantity
      }

      return next
    })
  }

  // ======================================================
  // 메뉴 카드 선택
  //
  // 수량이 0인 메뉴 카드를 누르면 1개 선택
  // 이미 선택된 메뉴는 +/- 버튼으로 수량 조절
  // ======================================================

  const handleMenuSelect = (menu) => {
    if (menu.available === false) {
      return
    }

    setMenuQuantities(
      (previous) => {
        const currentQuantity =
          previous[menu.id] || 0

        if (currentQuantity > 0) {
          return previous
        }

        return {
          ...previous,
          [menu.id]: 1,
        }
      }
    )
  }

  // ======================================================
  // 선주문
  // ======================================================

  const handleOrder = () => {
    if (
      !store ||
      selectedMenus.length === 0
    ) {
      return
    }

    const items =
      selectedMenus.map((menu) => ({
        menuId: menu.id,
        menuName: menu.name,
        price: Number(
          menu.price || 0
        ),
        quantity: menu.quantity,
      }))

    if (onOrder) {
      onOrder({
        storeId: store.id,
        storeName: store.name,

        // 여러 메뉴 주문 정보
        items,

        totalQuantity,
        totalPrice,
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

          <h2>
            가게 정보
          </h2>

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

          <h2>
            가게 정보
          </h2>

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

        <h2>
          {store.name}
        </h2>

        <div className="header-space" />

      </header>

      {/* ==================================================
          가게 대표 영역
      ================================================== */}

      <section className="store-hero">

      {store.imageUrl ? (
        <img
          className="store-hero-image"
          src={store.imageUrl}
          alt={store.name}
        />
      ) : (
        <div className="store-hero-icon">
          🍽️
        </div>
      )}

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

        </div>

        <div className="menu-list">

          {menus.map((menu) => {
            const quantity =
              menuQuantities[menu.id] || 0

            const isSelected =
              quantity > 0

            const isAvailable =
              menu.available !== false

            return (
              <div
                key={menu.id}
                className={`menu-card ${
                  isSelected
                    ? 'selected'
                    : ''
                } ${
                  !isAvailable
                    ? 'disabled'
                    : ''
                }`}
                role="button"
                tabIndex={
                  isAvailable ? 0 : -1
                }
                onClick={() =>
                  handleMenuSelect(menu)
                }
                onKeyDown={(event) => {
                  if (
                    isAvailable &&
                    (
                      event.key === 'Enter' ||
                      event.key === ' '
                    )
                  ) {
                    event.preventDefault()

                    handleMenuSelect(
                      menu
                    )
                  }
                }}
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

                {/* ==================================================
                    수량 조절
                ================================================== */}

                {isAvailable && (
                  <div
                    className="menu-quantity-control"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >

                    <button
                      type="button"
                      className="quantity-button"
                      onClick={(event) =>
                        handleDecrease(
                          event,
                          menu
                        )
                      }
                      disabled={
                        quantity === 0
                      }
                      aria-label={`${menu.name} 수량 감소`}
                    >
                      −
                    </button>

                    <span
                      className="menu-quantity"
                      aria-label={`${menu.name} 수량 ${quantity}개`}
                    >
                      {quantity}
                    </span>

                    <button
                      type="button"
                      className="quantity-button"
                      onClick={(event) =>
                        handleIncrease(
                          event,
                          menu
                        )
                      }
                      aria-label={`${menu.name} 수량 증가`}
                    >
                      +
                    </button>

                  </div>
                )}

              </div>
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
              selectedMenus.length === 0
            }
            onClick={handleOrder}
          >

            <span className="preorder-text">

              {selectedMenus.length === 0
                ? '선주문하기'
                : `${totalQuantity}개 · ${totalPrice.toLocaleString(
                    'ko-KR'
                  )}원 선주문하기`}

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

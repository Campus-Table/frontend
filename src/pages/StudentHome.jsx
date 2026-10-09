import { useEffect, useState } from 'react'

import {
  getCafeterias,
  getCafeteriaStores,
  getCafeteriaStatus,
} from '../api/cafeteriaApi'

function StudentHome({
  onStore,
  onOrders,
  onNotifications,
}) {
  const [cafeteria, setCafeteria] = useState(null)
  const [stores, setStores] = useState([])
  const [status, setStatus] = useState(null)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // ======================================================
  // 학생 홈 데이터 불러오기
  // ======================================================

  useEffect(() => {
    let cancelled = false

    const loadHomeData = async () => {
      try {
        setIsLoading(true)
        setError('')

        // 1. 학식당 목록 조회
        const cafeterias =
          await getCafeterias()

        if (cancelled) {
          return
        }

        if (
          !Array.isArray(cafeterias) ||
          cafeterias.length === 0
        ) {
          setError(
            '등록된 학생식당이 없습니다.'
          )
          setIsLoading(false)
          return
        }

        // 현재 화면은 학생식당 하나를 보여주는 구조이므로
        // 첫 번째 학식당을 사용
        const selectedCafeteria =
          cafeterias[0]

        setCafeteria(selectedCafeteria)

        // 2. 가게 목록 + 혼잡도 동시에 조회
        const [
          storeData,
          statusData,
        ] = await Promise.all([
          getCafeteriaStores(
            selectedCafeteria.id
          ),
          getCafeteriaStatus(
            selectedCafeteria.id
          ),
        ])

        if (cancelled) {
          return
        }

        setStores(
          Array.isArray(storeData)
            ? storeData
            : []
        )

        setStatus(statusData)
      } catch (error) {
        if (cancelled) {
          return
        }

        console.error(
          '학생 홈 데이터 조회 실패:',
          error
        )

        if (
          error.code === 'UNAUTHORIZED'
        ) {
          setError(
            '로그인이 필요합니다.'
          )
        } else {
          setError(
            error.message ||
              '학생식당 정보를 불러오지 못했습니다.'
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadHomeData()

    return () => {
      cancelled = true
    }
  }, [])

  // ======================================================
  // 가게 클릭
  // ======================================================

  const handleStoreClick = (storeId) => {
    if (onStore) {
      onStore(storeId)
    }
  }

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
    ).toLocaleString('ko-KR')}원~`
  }

  // ======================================================
  // 혼잡도 표시
  // ======================================================

  const getCongestionText = () => {
    switch (status?.congestionLevel) {
      case 'RELAXED':
        return '현재 여유'

      case 'NORMAL':
        return '현재 보통'

      case 'CROWDED':
        return '현재 혼잡'

      case 'VERY_CROWDED':
        return '현재 매우 혼잡'

      default:
        return '혼잡도 확인 중'
    }
  }

  const getCongestionMessage = () => {
    switch (status?.congestionLevel) {
      case 'RELAXED':
        return '현재 여유로워요. 편하게 이용할 수 있어요.'

      case 'NORMAL':
        return '현재 이용하기 적당한 상태예요.'

      case 'CROWDED':
        return '현재 혼잡해요. 이용 인원을 확인해주세요.'

      case 'VERY_CROWDED':
        return '현재 매우 혼잡해요. 도착하면 자리가 없을 수 있어요.'

      default:
        return '현재 혼잡도 정보를 확인하고 있어요.'
    }
  }

  // ======================================================
  // 마지막 업데이트 시간
  // ======================================================

  const getUpdateText = () => {
    if (!status?.recordedAt) {
      return '업데이트 확인 중'
    }

    const recordedTime =
      new Date(status.recordedAt)

    if (
      Number.isNaN(
        recordedTime.getTime()
      )
    ) {
      return '최근 업데이트'
    }

    const difference =
      Date.now() -
      recordedTime.getTime()

    const minutes =
      Math.max(
        0,
        Math.floor(
          difference / 60000
        )
      )

    if (minutes < 1) {
      return '방금 업데이트'
    }

    if (minutes < 60) {
      return `${minutes}분 전 업데이트`
    }

    return '최근 업데이트'
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

          <span className="notification-dot" />
        </button>

      </header>

      {/* ==================================================
          로딩
      ================================================== */}

      {isLoading && (
        <div className="auto-update">
          <span className="auto-update-icon">
            ⓘ
          </span>

          <span>
            학생식당 정보를 불러오는 중이에요.
          </span>
        </div>
      )}

      {/* ==================================================
          오류
      ================================================== */}

      {!isLoading && error && (
        <div className="auto-update">
          <span className="auto-update-icon">
            ⓘ
          </span>

          <span>{error}</span>
        </div>
      )}

      {/* ==================================================
          학생식당 실시간 혼잡도
      ================================================== */}

      {!isLoading && !error && (
        <section className="crowd-section">

          <div className="crowd-top">

            <div>
              <p className="crowd-small">
                {cafeteria?.name
                  ? `${cafeteria.name} 실시간 현황`
                  : '학생식당 실시간 현황'}
              </p>

              <div className="crowd-status">
                <span className="crowd-red-dot" />

                <strong>
                  {getCongestionText()}
                </strong>
              </div>
            </div>

            <span className="update-badge">
              {getUpdateText()}
            </span>

          </div>

          <div className="crowd-divider" />

          <div className="crowd-bottom">

            <div>
              <p>현재 이용 인원</p>

              <span>
                좌석 {status?.seatCount ?? 0}석 기준
              </span>
            </div>

            <strong className="crowd-number">
              {status?.currentPeople ?? 0}
              <span>명</span>
            </strong>

          </div>

          <div className="crowd-warning">
            {getCongestionMessage()}
          </div>

        </section>
      )}

      {/* ==================================================
          자동 업데이트 안내
      ================================================== */}

      {!isLoading && !error && (
        <div className="auto-update">
          <span className="auto-update-icon">
            ⓘ
          </span>

          <span>
            이용 인원과 혼잡도는 자동으로 갱신돼요.
          </span>
        </div>
      )}

      {/* ==================================================
          가게 목록
      ================================================== */}

      {!isLoading && !error && (
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
                onClick={() =>
                  handleStoreClick(store.id)
                }
              >

                {/* 가게 이미지 */}

                <div className="store-image">
                  {store.imageUrl ? (
                    <img
                      src={store.imageUrl}
                      alt={store.name}
                    />
                  ) : (
                    '🍽️'
                  )}
                </div>

                {/* 가게 정보 */}

                <div className="store-info">

                  <p className="store-category">
                    {store.description ||
                      store.category ||
                      '학생식당'}
                  </p>

                  <h3>
                    {store.name}
                  </h3>

                  <p className="store-menu">
                    {store.representativeMenuName ||
                      '메뉴 준비 중'}
                  </p>

                  <strong className="store-price">
                    {formatPrice(
                      store.minPrice
                    )}
                  </strong>

                </div>

              </button>
            ))}

            {stores.length === 0 && (
              <div className="auto-update">
                <span className="auto-update-icon">
                  ⓘ
                </span>

                <span>
                  현재 등록된 가게가 없습니다.
                </span>
              </div>
            )}

          </div>

        </section>
      )}

    </div>
  )
}

export default StudentHome 


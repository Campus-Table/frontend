import {
  useEffect,
  useState,
} from 'react'

import {
  getNotifications,
  markAllNotificationsRead,
} from '../api/notificationApi'

function Notifications() {
  // ========================================
  // 서버 알림 목록
  // ========================================
  const [
    notifications,
    setNotifications,
  ] = useState([])

  // ========================================
  // 화면 상태
  // ========================================
  const [
    isLoading,
    setIsLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')

  // ========================================
  // 서버 KST 시간 파싱
  //
  // 예:
  // 2026-10-09T12:38:34
  // 2026-10-09T12:38:34.123456
  // ========================================
  const parseServerTime = (
    value
  ) => {
    if (!value) {
      return null
    }

    const normalized =
      value.slice(0, 19)

    const date =
      new Date(
        `${normalized}+09:00`
      )

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return null
    }

    return date
  }

  // ========================================
  // 상대 시간 표시
  //
  // 방금
  // 8분 전
  // 2시간 전
  // 3일 전
  // ========================================
  const formatRelativeTime = (
    createdAt
  ) => {
    const createdDate =
      parseServerTime(
        createdAt
      )

    if (!createdDate) {
      return ''
    }

    const diffMilliseconds =
      Date.now() -
      createdDate.getTime()

    const diffSeconds =
      Math.max(
        0,
        Math.floor(
          diffMilliseconds /
            1000
        )
      )

    if (diffSeconds < 60) {
      return '방금'
    }

    const diffMinutes =
      Math.floor(
        diffSeconds / 60
      )

    if (diffMinutes < 60) {
      return `${diffMinutes}분 전`
    }

    const diffHours =
      Math.floor(
        diffMinutes / 60
      )

    if (diffHours < 24) {
      return `${diffHours}시간 전`
    }

    const diffDays =
      Math.floor(
        diffHours / 24
      )

    return `${diffDays}일 전`
  }

  // ========================================
  // 알림 종류별 아이콘
  //
  // 서버 type 6종
  // ========================================
  const getNotificationIcon = (type) => {
    const commonProps = {
      viewBox: '0 0 24 24',
      width: 24,
      height: 24,
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.8,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }

    switch (type) {
      /* 선주문 결제 완료 */
      case 'ORDER_PAID':
        return (
          <svg {...commonProps}>
            <circle cx="12" cy="12" r="9" />
            <path d="M8 12.5l2.5 2.5L16 9.5" />
          </svg>
        )

      /* 대기번호 발급 */
      case 'WAITING_NUMBER_ISSUED':
        return (
          <svg {...commonProps}>
            <path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3Z" />
            <path d="M9 8h6" />
            <path d="M9 12h6" />
            <path d="M9 16h3" />
          </svg>
        )

      /* 조리 시작 */
      case 'COOKING_STARTED':
        return (
          <svg {...commonProps}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        )

      /* 음식 수령 안내 */
      case 'FOOD_READY':
        return (
          <svg {...commonProps}>
            <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
          </svg>
        )

      /* 주문 취소 */
      case 'ORDER_CANCELLED':
        return (
          <svg {...commonProps}>
            <circle cx="12" cy="12" r="9" />
            <path d="M9 9l6 6" />
            <path d="M15 9l-6 6" />
          </svg>
        )

      /* 마일리지 충전 */
      case 'MILEAGE_CHARGED':
        return (
          <svg {...commonProps}>
            <circle cx="12" cy="12" r="9" />
            <path d="M7.5 8.5l2.2 7 2.3-7 2.3 7 2.2-7" />
            <path d="M7 11h10" />
            <path d="M7 14h10" />
          </svg>
        )

      /* 기타 */
      default:
        return (
          <svg {...commonProps}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8h.01" />
            <path d="M11 11h1v5h1" />
          </svg>
        )
    }
  }

  // ========================================
  // 알림 목록 조회
  // ========================================
  useEffect(() => {
    let isCancelled = false

    const loadNotifications =
      async () => {
        try {
          setIsLoading(true)
          setError('')

          // 최신 알림 30개 조회
          const result =
            await getNotifications({
              limit: 30,
            })

          if (isCancelled) {
            return
          }

          setNotifications(
            Array.isArray(result)
              ? result
              : []
          )

          // ==================================
          // 알림 화면을 열었으므로
          // 전체 읽음 처리
          //
          // 목록 출력에는 실패 영향을 주지 않게
          // 별도로 처리
          // ==================================
          try {
            await markAllNotificationsRead()
          } catch (
            readError
          ) {
            console.error(
              '알림 읽음 처리 실패:',
              readError
            )
          }
        } catch (apiError) {
          if (isCancelled) {
            return
          }

          console.error(
            '알림 조회 실패:',
            apiError
          )

          if (
            apiError.code ===
            'UNAUTHORIZED'
          ) {
            setError(
              '로그인이 만료되었습니다. 다시 로그인해주세요.'
            )

            return
          }

          setError(
            apiError.message ||
              '알림을 불러오지 못했습니다.'
          )
        } finally {
          if (!isCancelled) {
            setIsLoading(false)
          }
        }
      }

    loadNotifications()

    return () => {
      isCancelled = true
    }
  }, [])

  return (
    <div className="notifications-page">

      {/* =====================================
          상단
      ===================================== */}
      <header className="notifications-header">

        <h1>
          알림
        </h1>

        <p>
          주문 소식을 빠르게 확인하세요.
        </p>

      </header>

      <main className="notifications-content">

        {/* =====================================
            로딩
        ===================================== */}
        {isLoading && (
          <div className="notification-empty">

            <div className="notification-empty-icon">
              ◷
            </div>

            <strong>
              알림을 불러오고 있어요
            </strong>

            <p>
              잠시만 기다려주세요.
            </p>

          </div>
        )}

        {/* =====================================
            오류
        ===================================== */}
        {!isLoading &&
          error && (
            <div className="notification-empty">

              <div className="notification-empty-icon">
                !
              </div>

              <strong>
                알림을 불러오지 못했어요
              </strong>

              <p>
                {error}
              </p>

            </div>
          )}

        {/* =====================================
            서버 알림 목록
        ===================================== */}
        {!isLoading &&
          !error &&
          notifications.map(
            (notification) => {
              const isFoodReady =
                notification.type ===
                'FOOD_READY'

              return (
                <section
                  key={
                    notification.id
                  }
                  className={
                    isFoodReady
                      ? 'notification-card notification-card-primary'
                      : 'notification-card'
                  }
                >

                  {/* =========================
                      알림 아이콘
                  ========================= */}
                  <div
                    className={
                      isFoodReady
                        ? 'notification-icon primary-icon'
                        : 'notification-icon'
                    }
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* =========================
                      알림 내용
                  ========================= */}
                  <div className="notification-body">

                    <div className="notification-title-row">

                      <strong>
                        {notification.title}
                      </strong>

                      <span>
                        {formatRelativeTime(
                          notification.createdAt
                        )}
                      </span>

                    </div>

                    <p>
                      {notification.message}
                    </p>

                  </div>

                </section>
              )
            }
          )}

        {/* =====================================
            알림 없음
        ===================================== */}
        {!isLoading &&
          !error &&
          notifications.length ===
            0 && (
            <div className="notification-empty">

              <div className="notification-empty-icon">
                ♧
              </div>

              <strong>
                아직 알림이 없어요
              </strong>

              <p>
                주문을 시작하면 진행 상황을
                알려드릴게요.
              </p>

            </div>
          )}

      </main>

    </div>
  )
}

export default Notifications
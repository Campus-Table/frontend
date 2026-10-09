import {
  useEffect,
  useState,
} from 'react'

import {
  getPrimaryCafeteriaId,
  getAdminWaitings,
} from '../api/adminApi'

function AdminWaiting() {
  const [waitings, setWaitings] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('')

  const today =
    new Intl.DateTimeFormat(
      'ko-KR',
      {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }
    ).format(new Date())

  // ========================================
  // 대기번호
  // ========================================

  const formatWaitingNumber = (
    number
  ) => {
    if (
      number === null ||
      number === undefined
    ) {
      return '---'
    }

    return String(number).padStart(
      3,
      '0'
    )
  }

  // ========================================
  // 남은 시간
  // ========================================

  const formatRemainingTime = (
    seconds
  ) => {
    const safeSeconds =
      Math.max(
        Number(seconds) || 0,
        0
      )

    const minutes =
      Math.floor(
        safeSeconds / 60
      )

    const remaining =
      safeSeconds % 60

    return `${minutes}분 ${remaining}초`
  }

  // ========================================
  // 도착 시각
  // ========================================

  const formatTime = (
    dateTime
  ) => {
    if (!dateTime) {
      return '-'
    }

    const value =
      dateTime.slice(0, 19)

    const date =
      new Date(value)

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return '-'
    }

    return date.toLocaleTimeString(
      'ko-KR',
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }
    )
  }

  // ========================================
  // 메뉴명
  // ========================================

  const getItemName = (item) => {
    if (typeof item === 'string') {
      return item
    }

    return (
      item?.menuName ??
      item?.name ??
      '메뉴'
    )
  }

  const formatItems = (items) => {
    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return '메뉴 정보 없음'
    }

    const firstName =
      getItemName(items[0])

    if (items.length === 1) {
      return firstName
    }

    return `${firstName} 외 ${
      items.length - 1
    }개`
  }

  // ========================================
  // 상태
  // ========================================

  const getStatusText = (
    status
  ) => {
    if (status === 'COOKING') {
      return '조리 중'
    }

    // handoff 일부에는 READY,
    // 주문 상태 표에는 RECEIVED가 존재
    // 둘 다 대응
    if (
      status === 'READY' ||
      status === 'RECEIVED'
    ) {
      return '준비 완료'
    }

    return status || '진행 중'
  }

  // ========================================
  // 7초 폴링
  // ========================================

  useEffect(() => {
    let cancelled = false
    let intervalId = null

    const start = async () => {
      try {
        const cafeteriaId =
          await getPrimaryCafeteriaId()

        const load = async (
          initial = false
        ) => {
          try {
            if (initial) {
              setLoading(true)
            }

            const data =
              await getAdminWaitings(
                cafeteriaId
              )

            if (cancelled) {
              return
            }

            setWaitings(
              Array.isArray(data)
                ? data
                : []
            )

            setErrorMessage('')
          } catch (error) {
            if (cancelled) {
              return
            }

            if (
              error.status === 401
            ) {
              window.location.href =
                '/'
              return
            }

            setErrorMessage(
              error.message ||
                '대기 현황을 불러오지 못했습니다.'
            )
          } finally {
            if (
              initial &&
              !cancelled
            ) {
              setLoading(false)
            }
          }
        }

        await load(true)

        intervalId =
          setInterval(
            () => load(false),
            7000
          )
      } catch (error) {
        setLoading(false)

        setErrorMessage(
          error.message ||
            '학식당 정보를 불러오지 못했습니다.'
        )
      }
    }

    start()

    return () => {
      cancelled = true

      if (intervalId) {
        clearInterval(
          intervalId
        )
      }
    }
  }, [])

  return (
    <div className="admin-page">

      <header className="admin-header">

        <div className="admin-brand">

          <div className="admin-brand-icon">
            ♙
          </div>

          <strong>
            Campus Table
          </strong>

          <span className="admin-badge">
            관리자
          </span>

        </div>

        <p className="admin-date">
          {today}
        </p>

        <h1>
          현재 대기 현황
        </h1>

      </header>

      <main className="admin-content">

        <section className="waiting-summary">

          <div>

            <p>
              도착 인증 완료 주문
            </p>

            <strong>
              총 {waitings.length}건
            </strong>

          </div>

          <span className="live-badge">
            ● 실시간 갱신
          </span>

        </section>

        {loading && (
          <div className="admin-state-card">
            대기 현황을
            불러오는 중입니다.
          </div>
        )}

        {errorMessage && (
          <div className="admin-state-card error">
            {errorMessage}
          </div>
        )}

        {!loading &&
          !errorMessage &&
          waitings.length === 0 && (
            <div className="admin-state-card">
              현재 대기 중인
              주문이 없습니다.
            </div>
          )}

        <section className="waiting-list">

          {waitings.map(
            (waiting) => (

              <article
                key={
                  waiting.orderId ??
                  waiting.id
                }
                className="waiting-card"
              >

                <div className="waiting-card-top">

                  <strong className="waiting-number">
                    {formatWaitingNumber(
                      waiting.waitingNumber
                    )}
                    번
                  </strong>

                  <span className="verified-badge">
                    인증 완료 ·{' '}
                    {getStatusText(
                      waiting.status
                    )}
                  </span>

                </div>

                <h3>
                  {waiting.storeName ||
                    '가게'}
                  {' · '}
                  {formatItems(
                    waiting.items
                  )}
                </h3>

                <div className="waiting-card-divider" />

                <div className="waiting-time-grid">

                  <div>

                    <p>
                      도착 인증 시각
                    </p>

                    <strong>
                      {formatTime(
                        waiting.arrivedAt
                      )}
                    </strong>

                  </div>

                  <div>

                    <p>
                      준비 예상까지
                    </p>

                    <strong>
                      {formatRemainingTime(
                        waiting.remainingSeconds
                      )}
                    </strong>

                  </div>

                </div>

              </article>

            )
          )}

        </section>

      </main>

    </div>
  )
}

export default AdminWaiting
import {
  useEffect,
  useState,
} from 'react'

import {
  getPrimaryCafeteriaId,
  getAdminWaitings,
} from '../api/adminApi'

function AdminWaiting() {
  const [
    waitings,
    setWaitings,
  ] = useState([])

  const [
    loading,
    setLoading,
  ] = useState(true)

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

  // =========================
  // 대기번호
  // =========================

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

  // =========================
  // 남은 시간
  // =========================

  const formatRemainingTime = (
    seconds,
    status
  ) => {
    if (
      status === 'READY' ||
      status === 'RECEIVED'
    ) {
      return '준비 완료'
    }

    const safeSeconds =
      Math.max(
        Number(seconds) || 0,
        0
      )

    const minutes =
      Math.floor(
        safeSeconds / 60
      )

    const remainingSeconds =
      safeSeconds % 60

    return `${minutes}분 ${remainingSeconds}초`
  }

  // =========================
  // 도착 시각
  // =========================

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

  // =========================
  // 메뉴 표시
  // =========================

  const formatItems = (
    items
  ) => {
    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return '메뉴 정보 없음'
    }

    const firstMenu =
      items[0]?.menuName ||
      items[0]?.name ||
      '메뉴'

    if (items.length === 1) {
      return firstMenu
    }

    return `${firstMenu} 외 ${
      items.length - 1
    }개`
  }

  // =========================
  // 관리자 상태
  //
  // READY:
  // 예상 준비시간은 지났지만
  // 아직 RECEIVED 처리 전
  // =========================

  const getStatusText = (
    status
  ) => {
    if (status === 'COOKING') {
      return '조리 중'
    }

    if (status === 'READY') {
      return '준비 완료'
    }

    if (status === 'RECEIVED') {
      return '수령 안내'
    }

    return status || '진행 중'
  }

  // =========================
  // 대기 목록
  // 7초마다 polling
  // =========================

  useEffect(() => {
    let cancelled = false
    let intervalId = null

    const startPolling =
      async () => {
        try {
          const cafeteriaId =
            await getPrimaryCafeteriaId()

          const loadWaitings =
            async (
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

                console.error(
                  '관리자 대기 현황 조회 실패:',
                  error
                )

                if (
                  error.status === 401
                ) {
                  window.location.href =
                    '/'
                  return
                }

                if (
                  error.status === 403
                ) {
                  setErrorMessage(
                    '관리자 권한이 없습니다.'
                  )
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

          await loadWaitings(true)

          intervalId =
            setInterval(
              () =>
                loadWaitings(
                  false
                ),
              7000
            )
        } catch (error) {
          if (!cancelled) {
            setLoading(false)

            setErrorMessage(
              error.message ||
                '학식당 정보를 불러오지 못했습니다.'
            )
          }
        }
      }

    startPolling()

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

        <section className="admin-waiting-summary">

          <div>

            <p>
              도착 인증 완료 주문
            </p>

            <strong>
              총 {waitings.length}건
            </strong>

          </div>

          <span className="admin-live-badge">
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
              현재 대기 중인 주문이
              없습니다.
            </div>
          )}

        <section className="admin-waiting-list">

          {waitings.map(
            (waiting) => (

              <article
                key={
                  waiting.orderId ??
                  waiting.id
                }
                className="admin-waiting-card"
              >

                <div className="admin-waiting-card-top">

                  <strong className="admin-waiting-number">
                    {formatWaitingNumber(
                      waiting.waitingNumber
                    )}
                    번
                  </strong>

                  <span className="admin-verified-badge">
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

                <div className="admin-waiting-divider" />

                <div className="admin-waiting-time-grid">

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
                        waiting.remainingSeconds,
                        waiting.status
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
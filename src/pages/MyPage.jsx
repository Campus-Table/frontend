import { useEffect, useState } from 'react'
import {
  getMyInfo,
  getMyMileage,
  getMyMileageTransactions,
  getMyOrders,
  changeMyPassword,
  logout,
} from '../api/mypageApi'
import './MyPage.css'

function formatNumber(value) {
  return Number(value || 0).toLocaleString('ko-KR')
}

function formatDate(value) {
  if (!value) return '-'

  return value
    .slice(0, 16)
    .replace('T', ' ')
}

function getTransactionLabel(type) {
  switch (type) {
    case 'CHARGE':
      return '충전'
    case 'USE':
      return '사용'
    case 'REFUND':
      return '환불'
    default:
      return type
  }
}

function getTransactionSign(type) {
  return type === 'USE' ? '-' : '+'
}

function getOrderStatus(status) {
  switch (status) {
    case 'PAID':
      return {
        label: '도착 인증 전',
        className: 'mypage-status-paid',
      }

    case 'COOKING':
      return {
        label: '조리 중',
        className: 'mypage-status-cooking',
      }

    case 'RECEIVED':
      return {
        label: '완료',
        className: 'mypage-status-received',
      }

    case 'CANCELLED':
      return {
        label: '취소',
        className: 'mypage-status-cancelled',
      }

    default:
      return {
        label: status,
        className: '',
      }
  }
}

function getOrderMenuText(items = []) {
  if (!items.length) {
    return '메뉴 정보 없음'
  }

  const firstMenu =
    items[0]?.menuName || '메뉴'

  if (items.length === 1) {
    return firstMenu
  }

  return `${firstMenu} 외 ${items.length - 1}개`
}

export default function MyPage({
  onLogout,
  onUnauthorized,
}) {
  const [user, setUser] = useState(null)
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] =
    useState([])
  const [orders, setOrders] = useState([])

  const [loading, setLoading] =
    useState(true)

  const [errorMessage, setErrorMessage] =
    useState('')

  const [
    transactionOpen,
    setTransactionOpen,
  ] = useState(false)

  const [orderOpen, setOrderOpen] =
    useState(false)

  const [
    passwordOpen,
    setPasswordOpen,
  ] = useState(false)

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState('')

  const [
    newPassword,
    setNewPassword,
  ] = useState('')

  const [
    newPasswordConfirm,
    setNewPasswordConfirm,
  ] = useState('')

  const [
    passwordMessage,
    setPasswordMessage,
  ] = useState('')

  const [
    passwordError,
    setPasswordError,
  ] = useState('')

  const [
    changingPassword,
    setChangingPassword,
  ] = useState(false)

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadMyPage() {
      try {
        setLoading(true)
        setErrorMessage('')

        const [
          userData,
          mileageData,
          transactionData,
          orderData,
        ] = await Promise.all([
          getMyInfo(),
          getMyMileage(),
          getMyMileageTransactions(),
          getMyOrders(),
        ])

        if (cancelled) return

        setUser(userData)
        setBalance(
          mileageData?.balance ?? 0
        )

        setTransactions(
          Array.isArray(transactionData)
            ? transactionData
            : []
        )

        setOrders(
          Array.isArray(orderData)
            ? orderData
            : []
        )
      } catch (error) {
        if (cancelled) return

        console.error(
          '마이페이지 조회 실패:',
          error
        )

        if (error.status === 401) {
          onUnauthorized?.()
          return
        }

        setErrorMessage(
          error.message ||
            '마이페이지 정보를 불러오지 못했습니다.'
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadMyPage()

    return () => {
      cancelled = true
    }
  }, [onUnauthorized])

  async function handlePasswordChange(
    event
  ) {
    event.preventDefault()

    setPasswordError('')
    setPasswordMessage('')

    if (!currentPassword) {
      setPasswordError(
        '현재 비밀번호를 입력해주세요.'
      )
      return
    }

    if (
      newPassword.length < 8 ||
      newPassword.length > 50
    ) {
      setPasswordError(
        '새 비밀번호는 8~50자로 입력해주세요.'
      )
      return
    }

    if (
      currentPassword === newPassword
    ) {
      setPasswordError(
        '새 비밀번호는 현재 비밀번호와 달라야 합니다.'
      )
      return
    }

    if (
      newPassword !==
      newPasswordConfirm
    ) {
      setPasswordError(
        '새 비밀번호가 일치하지 않습니다.'
      )
      return
    }

    try {
      setChangingPassword(true)

      await changeMyPassword(
        currentPassword,
        newPassword
      )

      setPasswordMessage(
        '비밀번호가 변경되었습니다.'
      )

      setCurrentPassword('')
      setNewPassword('')
      setNewPasswordConfirm('')
    } catch (error) {
      console.error(
        '비밀번호 변경 실패:',
        error
      )

      if (
        error.code ===
        'INVALID_CURRENT_PASSWORD'
      ) {
        setPasswordError(
          '현재 비밀번호가 올바르지 않습니다.'
        )
        return
      }

      if (
        error.code ===
        'PASSWORD_UNCHANGED'
      ) {
        setPasswordError(
          '새 비밀번호는 현재 비밀번호와 달라야 합니다.'
        )
        return
      }

      if (
        error.code ===
        'TOO_MANY_LOGIN_ATTEMPTS'
      ) {
        setPasswordError(
          error.message ||
            '비밀번호 확인 시도가 너무 많습니다.'
        )
        return
      }

      setPasswordError(
        error.message ||
          '비밀번호 변경에 실패했습니다.'
      )
    } finally {
      setChangingPassword(false)
    }
  }

  async function handleLogout() {
    if (loggingOut) return

    try {
      setLoggingOut(true)

      await logout()

      onLogout?.()
    } catch (error) {
      console.error(
        '로그아웃 실패:',
        error
      )

      setErrorMessage(
        error.message ||
          '로그아웃에 실패했습니다.'
      )
    } finally {
      setLoggingOut(false)
    }
  }

  if (loading) {
    return (
      <main className="mypage">
        <div className="mypage-loading">
          <div className="mypage-loading-spinner" />
          <span>
            마이페이지를 불러오는 중입니다...
          </span>
        </div>
      </main>
    )
  }

  return (
    <main className="mypage">
      <header className="mypage-header">
        <div>
          <p className="mypage-header-caption">
            MY PAGE
          </p>

          <h1>마이페이지</h1>
        </div>
      </header>

      {errorMessage && (
        <div className="mypage-error-banner">
          {errorMessage}
        </div>
      )}

      <section className="mypage-profile-card">
        <div className="mypage-avatar">
          {user?.name?.slice(0, 1) || 'U'}
        </div>

        <div className="mypage-profile-info">
          <strong>
            {user?.name || '사용자'}
          </strong>

          <span>
            학번{' '}
            {user?.studentNumber || '-'}
          </span>
        </div>
      </section>

      <section className="mypage-mileage-card">
        <span className="mypage-section-caption">
          보유 마일리지
        </span>

        <strong className="mypage-mileage-value">
          {formatNumber(balance)}
          <small>P</small>
        </strong>
      </section>

      <section className="mypage-menu-section">
        <button
          type="button"
          className="mypage-menu-button"
          onClick={() =>
            setTransactionOpen(
              (previous) => !previous
            )
          }
        >
          <div>
            <strong>
              마일리지 내역
            </strong>

            <span>
              충전 및 사용 내역을
              확인합니다
            </span>
          </div>

          <span className="mypage-arrow">
            {transactionOpen
              ? '⌃'
              : '›'}
          </span>
        </button>

        {transactionOpen && (
          <div className="mypage-detail-box">
            {transactions.length ===
            0 ? (
              <p className="mypage-empty">
                아직 마일리지 내역이
                없습니다.
              </p>
            ) : (
              transactions.map(
                (transaction) => (
                  <div
                    className="mypage-transaction"
                    key={
                      transaction.id
                    }
                  >
                    <div>
                      <strong>
                        {getTransactionLabel(
                          transaction.type
                        )}
                      </strong>

                      <span>
                        {formatDate(
                          transaction.createdAt
                        )}
                      </span>
                    </div>

                    <div className="mypage-transaction-amount">
                      <strong
                        className={
                          transaction.type ===
                          'USE'
                            ? 'mypage-minus'
                            : 'mypage-plus'
                        }
                      >
                        {getTransactionSign(
                          transaction.type
                        )}
                        {formatNumber(
                          transaction.amount
                        )}
                        P
                      </strong>

                      <span>
                        잔액{' '}
                        {formatNumber(
                          transaction.balanceAfter
                        )}
                        P
                      </span>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        )}

        <button
          type="button"
          className="mypage-menu-button"
          onClick={() =>
            setOrderOpen(
              (previous) => !previous
            )
          }
        >
          <div>
            <strong>
              주문 내역
            </strong>

            <span>
              지금까지의 주문을
              확인합니다
            </span>
          </div>

          <span className="mypage-arrow">
            {orderOpen
              ? '⌃'
              : '›'}
          </span>
        </button>

        {orderOpen && (
          <div className="mypage-detail-box">
            {orders.length === 0 ? (
              <p className="mypage-empty">
                아직 주문 내역이
                없습니다.
              </p>
            ) : (
              orders.map((order) => {
                const status =
                  getOrderStatus(
                    order.status
                  )

                return (
                  <div
                    className="mypage-order"
                    key={
                      order.orderId
                    }
                  >
                    <div className="mypage-order-top">
                      <div>
                        <strong>
                          {
                            order.storeName
                          }
                        </strong>

                        <span>
                          {formatDate(
                            order.orderedAt
                          )}
                        </span>
                      </div>

                      <span
                        className={`mypage-status ${status.className}`}
                      >
                        {
                          status.label
                        }
                      </span>
                    </div>

                    <div className="mypage-order-bottom">
                      <span>
                        {getOrderMenuText(
                          order.items
                        )}
                      </span>

                      <strong>
                        {formatNumber(
                          order.totalPrice
                        )}
                        P
                      </strong>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        <button
          type="button"
          className="mypage-menu-button"
          onClick={() => {
            setPasswordOpen(
              (previous) => !previous
            )

            setPasswordError('')
            setPasswordMessage('')
          }}
        >
          <div>
            <strong>
              비밀번호 변경
            </strong>

            <span>
              계정 비밀번호를 변경합니다
            </span>
          </div>

          <span className="mypage-arrow">
            {passwordOpen
              ? '⌃'
              : '›'}
          </span>
        </button>

        {passwordOpen && (
          <form
            className="mypage-password-form"
            onSubmit={
              handlePasswordChange
            }
          >
            <label>
              현재 비밀번호

              <input
                type="password"
                value={
                  currentPassword
                }
                onChange={(event) =>
                  setCurrentPassword(
                    event.target.value
                  )
                }
                autoComplete="current-password"
                placeholder="현재 비밀번호"
              />
            </label>

            <label>
              새 비밀번호

              <input
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
                placeholder="8~50자"
              />
            </label>

            <label>
              새 비밀번호 확인

              <input
                type="password"
                value={
                  newPasswordConfirm
                }
                onChange={(event) =>
                  setNewPasswordConfirm(
                    event.target.value
                  )
                }
                autoComplete="new-password"
                placeholder="새 비밀번호 다시 입력"
              />
            </label>

            {passwordError && (
              <p className="mypage-form-error">
                {passwordError}
              </p>
            )}

            {passwordMessage && (
              <p className="mypage-form-success">
                {passwordMessage}
              </p>
            )}

            <button
              type="submit"
              className="mypage-password-submit"
              disabled={
                changingPassword
              }
            >
              {changingPassword
                ? '변경 중...'
                : '비밀번호 변경'}
            </button>
          </form>
        )}
      </section>

      <button
        type="button"
        className="mypage-logout-button"
        onClick={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut
          ? '로그아웃 중...'
          : '로그아웃'}
      </button>

      <p className="mypage-footer-text">
        Campus Table
      </p>
    </main>
  )
}
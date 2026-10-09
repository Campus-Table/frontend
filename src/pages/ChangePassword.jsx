import { useState } from 'react'
import { changePassword } from '../api/authApi'

function ChangePassword({
  onBack,
  onComplete,
}) {
  const [currentPassword, setCurrentPassword] =
    useState('')

  const [newPassword, setNewPassword] =
    useState('')

  const [
    newPasswordConfirm,
    setNewPasswordConfirm,
  ] = useState('')

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] =
    useState(false)

  const handleChangePassword = async () => {
    if (!currentPassword) {
      setError(
        '현재 비밀번호를 입력해주세요.'
      )
      return
    }

    if (
      newPassword.length < 8 ||
      newPassword.length > 50
    ) {
      setError(
        '새 비밀번호는 8~50자로 입력해주세요.'
      )
      return
    }

    if (newPassword !== newPasswordConfirm) {
      setError(
        '새 비밀번호가 일치하지 않습니다.'
      )
      return
    }

    if (currentPassword === newPassword) {
      setError(
        '새 비밀번호는 현재 비밀번호와 다르게 설정해주세요.'
      )
      return
    }

    if (isLoading) {
      return
    }

    try {
      setIsLoading(true)
      setError('')

      await changePassword(
        currentPassword,
        newPassword
      )

      alert(
        '비밀번호가 변경되었습니다.'
      )

      if (onComplete) {
        onComplete()
      }
    } catch (error) {
      console.error(
        '비밀번호 변경 실패:',
        error
      )

      if (
        error.code ===
        'INVALID_CURRENT_PASSWORD'
      ) {
        setError(
          '현재 비밀번호가 올바르지 않습니다.'
        )
      } else if (
        error.code === 'PASSWORD_UNCHANGED'
      ) {
        setError(
          '새 비밀번호는 현재 비밀번호와 다르게 설정해주세요.'
        )
      } else if (
        error.code === 'UNAUTHORIZED'
      ) {
        setError(
          '로그인이 필요합니다. 다시 로그인해주세요.'
        )
      } else {
        setError(
          error.message ||
            '비밀번호 변경에 실패했습니다.'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="auth-flow-page">

      {/* 뒤로가기 */}
      <button
        type="button"
        className="auth-back"
        onClick={onBack}
        aria-label="뒤로가기"
      >
        ‹
      </button>

      <section className="auth-step">

        <p className="auth-step-label">
          PASSWORD
        </p>

        <h1>
          비밀번호를 변경해주세요
        </h1>

        <p className="auth-description">
          현재 비밀번호를 확인한 후
          <br />
          새로운 비밀번호를 설정해주세요.
        </p>

        {/* 현재 비밀번호 */}
        <div className="auth-input-group">
          <label htmlFor="current-password">
            현재 비밀번호
          </label>

          <input
            id="current-password"
            type="password"
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(
                e.target.value
              )
              setError('')
            }}
            autoComplete="current-password"
          />
        </div>

        {/* 새 비밀번호 */}
        <div className="auth-input-group">
          <label htmlFor="change-new-password">
            새 비밀번호
          </label>

          <input
            id="change-new-password"
            type="password"
            maxLength="50"
            placeholder="8~50자 비밀번호"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(
                e.target.value
              )
              setError('')
            }}
            autoComplete="new-password"
          />
        </div>

        {/* 새 비밀번호 확인 */}
        <div className="auth-input-group">
          <label htmlFor="change-password-confirm">
            새 비밀번호 확인
          </label>

          <input
            id="change-password-confirm"
            type="password"
            maxLength="50"
            placeholder="비밀번호 다시 입력"
            value={newPasswordConfirm}
            onChange={(e) => {
              setNewPasswordConfirm(
                e.target.value
              )
              setError('')
            }}
            autoComplete="new-password"
          />
        </div>

        {/* 오류 */}
        {error && (
          <p className="auth-error-message">
            {error}
          </p>
        )}

        {/* 변경 버튼 */}
        <button
          type="button"
          className="auth-main-button"
          onClick={handleChangePassword}
          disabled={isLoading}
        >
          {isLoading
            ? '변경 중...'
            : '비밀번호 변경'}
        </button>

      </section>

    </main>
  )
}

export default ChangePassword


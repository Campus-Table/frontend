import { useState } from 'react'
import { login } from '../api/authApi'

function Login({
  onBack,
  onLogin,
  onSignup,
  onForgotPassword,
}) {
  const [studentNumber, setStudentNumber] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isComplete =
    studentNumber.length === 8 &&
    password.length > 0

  const handleStudentNumberChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, '')
      .slice(0, 8)

    setStudentNumber(value)
    setError('')
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    setError('')
  }

  const handleLogin = async () => {
    if (!isComplete || isSubmitting) {
      return
    }

    try {
      setIsSubmitting(true)
      setError('')

      const user = await login(
        studentNumber,
        password
      )

      console.log('로그인 성공:', user)

      if (onLogin) {
        onLogin(user)
      }
    } catch (error) {
      console.error('로그인 실패:', error)

      if (error.code === 'INVALID_CREDENTIALS') {
        setError(
          '학번 또는 비밀번호가 올바르지 않습니다.'
        )
      } else if (
        error.code === 'TOO_MANY_LOGIN_ATTEMPTS'
      ) {
        setError(
          error.message ||
            '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.'
        )
      } else {
        setError(
          error.message ||
            '로그인에 실패했습니다. 다시 시도해주세요.'
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (event) => {
    if (
      event.key === 'Enter' &&
      isComplete &&
      !isSubmitting
    ) {
      handleLogin()
    }
  }

  return (
    <main className="login-page">

      {/* 뒤로가기 */}
      <button
        type="button"
        className="login-back"
        onClick={onBack}
        aria-label="뒤로가기"
      >
        ‹
      </button>

      {/* 로고 */}
      <header className="login-brand">
        <div className="login-brand-icon">
          ♙
        </div>

        <h1>Campus Table</h1>
      </header>

      {/* 로그인 소개 */}
      <section className="login-intro">
        <p className="login-label">
          WELCOME BACK
        </p>

        <h2>학교 구성원 로그인</h2>

        <p className="login-description">
          학번과 비밀번호를 입력해주세요.
        </p>
      </section>

      {/* 입력 영역 */}
      <section className="login-form">

        {/* 학번 */}
        <div className="input-group">
          <label htmlFor="student-number">
            학번
          </label>

          <input
            id="student-number"
            type="text"
            inputMode="numeric"
            placeholder="8자리 학번"
            maxLength="8"
            value={studentNumber}
            onChange={handleStudentNumberChange}
            onKeyDown={handleKeyDown}
            autoComplete="username"
          />
        </div>

        {/* 비밀번호 */}
        <div className="input-group">
          <label htmlFor="password">
            비밀번호
          </label>

          <input
            id="password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={handlePasswordChange}
            onKeyDown={handleKeyDown}
            autoComplete="current-password"
          />
        </div>

        {/* 오류 메시지 */}
        {error && (
          <div className="login-error-message">
            <span>!</span>
            <p>{error}</p>
          </div>
        )}

        {/* 비밀번호 찾기 */}
        <div className="forgot-password-row">
          <button
            type="button"
            className="forgot-password-button"
            onClick={onForgotPassword}
          >
            비밀번호를 잊으셨나요?
          </button>
        </div>

        {/* 로그인 */}
        <button
          type="button"
          className="login-submit"
          onClick={handleLogin}
          disabled={!isComplete || isSubmitting}
        >
          {isSubmitting
            ? '로그인 중...'
            : '로그인'}
        </button>

        {/* 안내 */}
        <div className="login-info">
          <span className="info-icon">
            ⓘ
          </span>

          <span>
            학번과 비밀번호를 입력하여 로그인해주세요.
          </span>
        </div>

        {/* 회원가입 */}
        <div className="signup-guide">
          <span>
            계정이 없으신가요?
          </span>

          <button
            type="button"
            className="signup-link"
            onClick={onSignup}
          >
            회원가입
          </button>
        </div>

      </section>

    </main>
  )
}

export default Login 
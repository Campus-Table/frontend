import { useEffect, useState } from 'react'

import {
  sendPasswordResetCode,
  resetPassword,
} from '../api/authApi'

function ForgotPassword({ onBack, onComplete }) {
  const [step, setStep] = useState(1)

  const [studentNumber, setStudentNumber] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const [remainingSeconds, setRemainingSeconds] = useState(5 * 60)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (step !== 2) {
      return
    }

    if (remainingSeconds <= 0) {
      return
    }

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [step, remainingSeconds])

  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60

  const formattedTime =
    `${minutes}:${seconds.toString().padStart(2, '0')}`

  const goBack = () => {
    setError('')

    if (step === 1) {
      onBack()
    } else {
      setStep((prev) => prev - 1)
    }
  }

  const handleStudentNumberChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, '')
      .slice(0, 8)

    setStudentNumber(value)
    setError('')
  }

  const handleCodeChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, '')
      .slice(0, 6)

    setCode(value)
    setError('')
  }

  const handleSendCode = async () => {
    if (studentNumber.length !== 8) {
      setError('8자리 학번을 입력해주세요.')
      return
    }

    if (isLoading) {
      return
    }

    try {
      setIsLoading(true)
      setError('')

      await sendPasswordResetCode(studentNumber)

      setCode('')
      setRemainingSeconds(5 * 60)
      setStep(2)
    } catch (error) {
      console.error(
        '비밀번호 재설정 인증번호 발송 실패:',
        error
      )

      if (error.code === 'TOO_MANY_REQUESTS') {
        setError(
          error.message ||
            '인증번호 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
        )
      } else if (error.code === 'MAIL_SEND_FAILED') {
        setError(
          '인증 메일을 발송하지 못했습니다.'
        )
      } else {
        setError(
          error.message ||
            '인증번호 발송에 실패했습니다.'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (isLoading) {
      return
    }

    try {
      setIsLoading(true)
      setError('')

      await sendPasswordResetCode(studentNumber)

      setCode('')
      setRemainingSeconds(5 * 60)
    } catch (error) {
      console.error(
        '비밀번호 재설정 인증번호 재발송 실패:',
        error
      )

      if (error.code === 'TOO_MANY_REQUESTS') {
        setError(
          error.message ||
            '인증번호 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
        )
      } else {
        setError(
          error.message ||
            '인증번호 재발송에 실패했습니다.'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = () => {
    if (code.length !== 6) {
      setError('6자리 인증번호를 입력해주세요.')
      return
    }

    if (remainingSeconds <= 0) {
      setError(
        '인증번호가 만료되었습니다. 인증번호를 다시 요청해주세요.'
      )
      return
    }

    setError('')
    setStep(3)
  }

  const handleResetPassword = async () => {
    if (
      newPassword.length < 8 ||
      newPassword.length > 50
    ) {
      setError(
        '비밀번호는 8~50자로 입력해주세요.'
      )
      return
    }

    if (newPassword !== passwordConfirm) {
      setError(
        '비밀번호가 일치하지 않습니다.'
      )
      return
    }

    if (isLoading) {
      return
    }

    try {
      setIsLoading(true)
      setError('')

      await resetPassword(
        studentNumber,
        code,
        newPassword
      )

      alert('비밀번호가 변경되었습니다.')

      onComplete()
    } catch (error) {
      console.error(
        '비밀번호 재설정 실패:',
        error
      )

      if (
        error.code ===
        'INVALID_VERIFICATION_CODE'
      ) {
        setError(
          '인증번호가 올바르지 않거나 만료되었습니다.'
        )
      } else if (
        error.code === 'TOO_MANY_REQUESTS'
      ) {
        setError(
          error.message ||
            '인증번호 확인 횟수를 초과했습니다. 인증번호를 다시 요청해주세요.'
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

      <button
        type="button"
        className="auth-back"
        onClick={goBack}
        aria-label="뒤로가기"
      >
        ‹
      </button>

      <div className="auth-progress">
        <div
          className={`progress-bar ${
            step >= 1 ? 'active' : ''
          }`}
        />

        <div
          className={`progress-bar ${
            step >= 2 ? 'active' : ''
          }`}
        />

        <div
          className={`progress-bar ${
            step >= 3 ? 'active' : ''
          }`}
        />
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <section className="auth-step">
          <p className="auth-step-label">
            STEP 1
          </p>

          <h1>학번을 입력해주세요</h1>

          <p className="auth-description">
            비밀번호 재설정을 위해
            <br />
            학번을 입력해주세요.
          </p>

          <div className="auth-input-group">
            <label htmlFor="reset-student-number">
              학번
            </label>

            <input
              id="reset-student-number"
              type="text"
              inputMode="numeric"
              maxLength="8"
              placeholder="8자리 학번"
              value={studentNumber}
              onChange={handleStudentNumberChange}
            />
          </div>

          {error && (
            <p className="auth-error-message">
              {error}
            </p>
          )}

          <button
            type="button"
            className="auth-main-button"
            onClick={handleSendCode}
            disabled={
              studentNumber.length !== 8 ||
              isLoading
            }
          >
            {isLoading
              ? '발송 중...'
              : '인증번호 받기'}
          </button>
        </section>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <section className="auth-step">
          <p className="auth-step-label">
            STEP 2
          </p>

          <h1>
            인증번호를 입력해주세요
          </h1>

          <p className="auth-description">
            학교 이메일로 보낸 6자리 번호를 입력해주세요.
          </p>

          <input
            className="verification-code-input"
            type="text"
            inputMode="numeric"
            maxLength="6"
            placeholder="6자리 인증번호"
            value={code}
            onChange={handleCodeChange}
          />

          <div className="verification-info">
            <span className="remaining-time">
              남은 시간 {formattedTime}
            </span>

            <button
              type="button"
              className="resend-button"
              onClick={handleResendCode}
              disabled={isLoading}
            >
              재발송
            </button>
          </div>

          {error && (
            <p className="auth-error-message">
              {error}
            </p>
          )}

          <button
            type="button"
            className="auth-main-button"
            onClick={handleVerifyCode}
            disabled={
              code.length !== 6 ||
              remainingSeconds <= 0 ||
              isLoading
            }
          >
            인증번호 확인
          </button>
        </section>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <section className="auth-step">
          <p className="auth-step-label">
            STEP 3
          </p>

          <h1>
            새 비밀번호를 설정해주세요
          </h1>

          <p className="auth-description">
            새로운 비밀번호를 입력해주세요.
          </p>

          <div className="auth-input-group">
            <label htmlFor="new-password">
              새 비밀번호
            </label>

            <input
              id="new-password"
              type="password"
              maxLength="50"
              placeholder="8~50자 비밀번호"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                setError('')
              }}
              autoComplete="new-password"
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="new-password-confirm">
              새 비밀번호 확인
            </label>

            <input
              id="new-password-confirm"
              type="password"
              maxLength="50"
              placeholder="비밀번호 다시 입력"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(
                  e.target.value
                )
                setError('')
              }}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <p className="auth-error-message">
              {error}
            </p>
          )}

          <button
            type="button"
            className="auth-main-button"
            onClick={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading
              ? '변경 중...'
              : '비밀번호 변경'}
          </button>
        </section>
      )}

    </main>
  )
}

export default ForgotPassword 

import { useState } from 'react'

function ForgotPassword({ onBack, onComplete }) {
  const [step, setStep] = useState(1)

  const [studentNumber, setStudentNumber] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const goBack = () => {
    if (step === 1) {
      onBack()
    } else {
      setStep(step - 1)
    }
  }

  const handleSendCode = () => {
    if (studentNumber.length !== 8) {
      alert('8자리 학번을 입력해주세요.')
      return
    }

    // 나중에 비밀번호 재설정 코드 발송 API 연결
    setStep(2)
  }

  const handleVerifyCode = () => {
    if (code.length !== 6) {
      alert('6자리 인증번호를 입력해주세요.')
      return
    }

    /*
      비밀번호 재설정 API는
      studentNumber + code + newPassword를
      함께 보내므로 여기서는 화면만 다음 단계로 이동
    */

    setStep(3)
  }

  const handleResetPassword = () => {
    if (
      newPassword.length < 8 ||
      newPassword.length > 50
    ) {
      alert('비밀번호는 8~50자로 입력해주세요.')
      return
    }

    if (newPassword !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }

    /*
      나중에 API 연결

      {
        studentNumber,
        code,
        newPassword
      }
    */

    alert('비밀번호가 변경되었습니다.')
    onComplete()
  }

  return (
    <main className="auth-flow-page">

      <button
        className="auth-back"
        onClick={goBack}
        aria-label="뒤로가기"
      >
        ‹
      </button>

      <div className="auth-progress">
        <div className={`progress-bar ${step >= 1 ? 'active' : ''}`} />
        <div className={`progress-bar ${step >= 2 ? 'active' : ''}`} />
        <div className={`progress-bar ${step >= 3 ? 'active' : ''}`} />
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <section className="auth-step">
          <p className="auth-step-label">STEP 1</p>

          <h1>학번을 입력해주세요</h1>

          <p className="auth-description">
            비밀번호 재설정을 위해
            <br />
            학번을 입력해주세요.
          </p>

          <div className="auth-input-group">
            <label>학번</label>

            <input
              type="text"
              inputMode="numeric"
              maxLength="8"
              placeholder="8자리 학번"
              value={studentNumber}
              onChange={(e) =>
                setStudentNumber(
                  e.target.value.replace(/\D/g, '')
                )
              }
            />
          </div>

          <button
            className="auth-main-button"
            onClick={handleSendCode}
          >
            인증번호 받기
          </button>
        </section>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <section className="auth-step">
          <p className="auth-step-label">STEP 2</p>

          <h1>인증번호를 입력해주세요</h1>

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
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, ''))
            }
          />

          <div className="verification-info">
            <span className="remaining-time">
              남은 시간 04:32
            </span>

            <button
              type="button"
              className="resend-button"
            >
              재발송
            </button>
          </div>

          <button
            className="auth-main-button"
            onClick={handleVerifyCode}
          >
            인증번호 확인
          </button>
        </section>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <section className="auth-step">
          <p className="auth-step-label">STEP 3</p>

          <h1>새 비밀번호를 설정해주세요</h1>

          <p className="auth-description">
            새로운 비밀번호를 입력해주세요.
          </p>

          <div className="auth-input-group">
            <label>새 비밀번호</label>

            <input
              type="password"
              maxLength="50"
              placeholder="8~50자 비밀번호"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
            />
          </div>

          <div className="auth-input-group">
            <label>새 비밀번호 확인</label>

            <input
              type="password"
              maxLength="50"
              placeholder="비밀번호 다시 입력"
              value={passwordConfirm}
              onChange={(e) =>
                setPasswordConfirm(e.target.value)
              }
            />
          </div>

          <button
            className="auth-main-button"
            onClick={handleResetPassword}
          >
            비밀번호 변경
          </button>
        </section>
      )}

    </main>
  )
}

export default ForgotPassword  


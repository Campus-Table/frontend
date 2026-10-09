import { useState } from 'react'

function Signup({ onBack, onSignupComplete }) {
  const [step, setStep] = useState(1)

  const [studentNumber, setStudentNumber] = useState('')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
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

    // 나중에 인증 코드 발송 API 연결
    setStep(2)
  }

  const handleVerifyCode = () => {
    if (code.length !== 6) {
      alert('6자리 인증번호를 입력해주세요.')
      return
    }

    // 나중에 인증 코드 확인 API 연결
    setStep(3)
  }

  const handleSignup = () => {
    if (!name.trim()) {
      alert('이름을 입력해주세요.')
      return
    }

    if (password.length < 8 || password.length > 50) {
      alert('비밀번호는 8~50자로 입력해주세요.')
      return
    }

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }

    // 나중에 회원가입 API 연결
    alert('회원가입이 완료되었습니다.')
    onSignupComplete()
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

      {/* 진행 표시 */}
      <div className="auth-progress">
        <div className={`progress-bar ${step >= 1 ? 'active' : ''}`} />
        <div className={`progress-bar ${step >= 2 ? 'active' : ''}`} />
        <div className={`progress-bar ${step >= 3 ? 'active' : ''}`} />
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <section className="auth-step">
          <p className="auth-step-label">STEP 1</p>

          <h1>학교 이메일을 인증해주세요</h1>

          <p className="auth-description">
            입력한 학번의 단국대학교 이메일로
            <br />
            인증번호를 보내드려요.
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
              onClick={() => {
                // 나중에 재발송 API 연결
              }}
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

          <h1>사용자 정보를 설정해주세요</h1>

          <div className="auth-input-group">
            <label>이름</label>

            <input
              type="text"
              maxLength="50"
              placeholder="이름 입력"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="auth-input-group">
            <label>비밀번호</label>

            <input
              type="password"
              maxLength="50"
              placeholder="8~50자 비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="auth-input-group">
            <label>비밀번호 확인</label>

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
            onClick={handleSignup}
          >
            가입 완료
          </button>
        </section>
      )}

    </main>
  )
}

export default Signup  


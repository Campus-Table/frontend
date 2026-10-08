import { useRef, useState } from 'react'

function ArrivalVerify({ onBack, onSuccess }) {
  const CORRECT_CODE = '4821'

  const [code, setCode] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const [verified, setVerified] = useState(false)

  const inputRefs = useRef([])

  const handleChange = (index, value) => {
    const number = value.replace(/\D/g, '').slice(-1)

    const newCode = [...code]
    newCode[index] = number

    setCode(newCode)
    setError('')

    if (number && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace') {
      if (code[index]) {
        const newCode = [...code]
        newCode[index] = ''
        setCode(newCode)
        setError('')
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handlePaste = (event) => {
    event.preventDefault()

    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 4)

    if (!pasted) return

    const newCode = ['', '', '', '']

    pasted.split('').forEach((number, index) => {
      newCode[index] = number
    })

    setCode(newCode)
    setError('')

    const nextIndex = Math.min(pasted.length, 3)
    inputRefs.current[nextIndex]?.focus()
  }

  const enteredCode = code.join('')
  const isComplete = enteredCode.length === 4

  const handleVerify = () => {
    if (!isComplete) return

    if (enteredCode === CORRECT_CODE) {
      setError('')
      setVerified(true)
      return
    }

    setError('현장 번호가 올바르지 않습니다. 다시 입력해주세요.')
    setCode(['', '', '', ''])

    setTimeout(() => {
      inputRefs.current[0]?.focus()
    }, 0)
  }

  /*
    현장 번호 인증 성공 화면
  */
  if (verified) {
    return (
      <div className="arrival-verify-page">
        <header className="arrival-verify-header">
          <button
            type="button"
            className="arrival-back-button"
            onClick={() => setVerified(false)}
            aria-label="뒤로가기"
          >
            ‹
          </button>

          <h2>현장 도착 인증</h2>

          <div className="arrival-header-space" />
        </header>

        <main className="arrival-success-content">
          <div className="arrival-success-icon">
            ✓
          </div>

          <h1>도착이 확인되었습니다</h1>

          <p className="arrival-success-description">
            대기번호를 발급하고 음식 조리를 시작할게요.
          </p>

          <div className="arrival-success-card">
            <span className="arrival-success-label">
              입력한 현장 번호
            </span>

            <strong className="arrival-success-code">
              {enteredCode.split('').join(' ')}
            </strong>

            <div className="arrival-success-divider" />

            <p>
              대기번호는 다음 단계에서 시스템이 별도로 발급합니다.
            </p>
          </div>

          <button
            type="button"
            className="waiting-number-button"
            onClick={onSuccess}
          >
            대기번호 확인하기
          </button>
        </main>
      </div>
    )
  }

  /*
    현장 번호 입력 화면
  */
  return (
    <div className="arrival-verify-page">
      <header className="arrival-verify-header">
        <button
          type="button"
          className="arrival-back-button"
          onClick={onBack}
          aria-label="뒤로가기"
        >
          ‹
        </button>

        <h2>현장 도착 인증</h2>

        <div className="arrival-header-space" />
      </header>

      <main className="arrival-verify-content">
        <div className="arrival-store-icon">
          <span>▱</span>
        </div>

        <h1>오늘의 현장 번호</h1>

        <p className="arrival-description">
          학생식당에 표시된 오늘의 번호를 입력해주세요.
        </p>

        <div className="arrival-code-inputs">
          {code.map((number, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element
              }}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={number}
              onChange={(event) =>
                handleChange(index, event.target.value)
              }
              onKeyDown={(event) =>
                handleKeyDown(index, event)
              }
              onPaste={handlePaste}
              className={`arrival-code-input ${
                error ? 'error' : ''
              }`}
              aria-label={`현장 번호 ${index + 1}번째 자리`}
            />
          ))}
        </div>

        <div className="arrival-number-info">
          <span>ⓘ</span>

          <p>
            현장 번호는 대기번호와 다른 도착 인증용 번호예요.
          </p>
        </div>

        <p className="arrival-demo-code">
          데모 번호 4821 입력
        </p>

        {error && (
          <div className="arrival-error-message">
            <span>!</span>

            <p>{error}</p>
          </div>
        )}

        <button
          type="button"
          className="arrival-confirm-button"
          disabled={!isComplete}
          onClick={handleVerify}
        >
          도착 확인
        </button>
      </main>
    </div>
  )
}

export default ArrivalVerify
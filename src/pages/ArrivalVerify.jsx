import {
  useRef,
  useState,
} from 'react'

import {
  verifyArrival,
} from '../api/orderApi'

function ArrivalVerify({
  orderId,
  onBack,
  onSuccess,
}) {
  // ========================================
  // 현장 번호 4자리
  // ========================================
  const [
    code,
    setCode,
  ] = useState([
    '',
    '',
    '',
    '',
  ])

  // ========================================
  // 화면 상태
  // ========================================
  const [
    error,
    setError,
  ] = useState('')

  const [
    verified,
    setVerified,
  ] = useState(false)

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false)

  // ========================================
  // 인증 성공 후 서버가 내려준
  // 공통 주문 응답
  // ========================================
  const [
    arrivalResult,
    setArrivalResult,
  ] = useState(null)

  const inputRefs =
    useRef([])

  // ========================================
  // 숫자 한 자리 입력
  // ========================================
  const handleChange = (
    index,
    value
  ) => {
    const number =
      value
        .replace(
          /\D/g,
          ''
        )
        .slice(-1)

    const newCode = [
      ...code,
    ]

    newCode[index] =
      number

    setCode(newCode)
    setError('')

    if (
      number &&
      index < 3
    ) {
      inputRefs
        .current[
          index + 1
        ]
        ?.focus()
    }
  }

  // ========================================
  // Backspace
  // ========================================
  const handleKeyDown = (
    index,
    event
  ) => {
    if (
      event.key !==
      'Backspace'
    ) {
      return
    }

    if (code[index]) {
      const newCode = [
        ...code,
      ]

      newCode[index] = ''

      setCode(newCode)
      setError('')

      return
    }

    if (index > 0) {
      inputRefs
        .current[
          index - 1
        ]
        ?.focus()
    }
  }

  // ========================================
  // 4자리 붙여넣기
  // ========================================
  const handlePaste = (
    event
  ) => {
    event.preventDefault()

    const pasted =
      event.clipboardData
        .getData('text')
        .replace(
          /\D/g,
          ''
        )
        .slice(0, 4)

    if (!pasted) {
      return
    }

    const newCode = [
      '',
      '',
      '',
      '',
    ]

    pasted
      .split('')
      .forEach(
        (
          number,
          index
        ) => {
          newCode[index] =
            number
        }
      )

    setCode(newCode)
    setError('')

    const nextIndex =
      Math.min(
        pasted.length,
        3
      )

    inputRefs
      .current[
        nextIndex
      ]
      ?.focus()
  }

  // ========================================
  // 입력한 4자리 번호
  // ========================================
  const enteredCode =
    code.join('')

  const isComplete =
    enteredCode.length ===
    4

  // ========================================
  // 번호 초기화
  // ========================================
  const resetCode = () => {
    setCode([
      '',
      '',
      '',
      '',
    ])

    setTimeout(() => {
      inputRefs
        .current[0]
        ?.focus()
    }, 0)
  }

  // ========================================
  // 현장 도착 인증
  // ========================================
  const handleVerify =
    async () => {
      if (
        !isComplete ||
        isSubmitting
      ) {
        return
      }

      // 실제 연결 시 orderId 필수
      if (!orderId) {
        setError(
          '주문 정보를 불러오지 못했습니다. 이전 화면으로 돌아가 다시 시도해주세요.'
        )

        return
      }

      try {
        setIsSubmitting(
          true
        )

        setError('')

        // ==================================
        // POST
        // /api/orders/{orderId}/arrival
        //
        // body:
        // { code: "1234" }
        // ==================================
        const result =
          await verifyArrival(
            orderId,
            enteredCode
          )

        // ==================================
        // 성공 응답:
        //
        // {
        //   orderId,
        //   storeId,
        //   storeName,
        //   status: "COOKING",
        //   totalPrice,
        //   items,
        //   waitingNumber,
        //   expectedReadyAt,
        //   remainingSeconds,
        //   orderedAt,
        //   arrivedAt,
        //   ...
        // }
        // ==================================
        setArrivalResult(
          result
        )

        setVerified(true)
      } catch (apiError) {
        console.error(
          '현장 도착 인증 실패:',
          apiError
        )

        switch (
          apiError.code
        ) {
          // ================================
          // 현장 번호 틀림
          // ================================
          case 'INVALID_ARRIVAL_CODE':
            setError(
              '현장 번호가 올바르지 않습니다. 안내판의 번호를 다시 확인해주세요.'
            )

            resetCode()

            break

          // ================================
          // code 값 검증 실패
          // ================================
          case 'VALIDATION_FAILED':
            setError(
              apiError.message ||
                '현장 번호를 다시 확인해주세요.'
            )

            resetCode()

            break

          // ================================
          // 이미 인증됐거나 취소된 주문 등
          // PAID 상태가 아님
          // ================================
          case 'INVALID_ORDER_STATUS':
            setError(
              apiError.message ||
                '현재 주문 상태에서는 도착 인증을 할 수 없습니다.'
            )

            break

          // ================================
          // 로그인 만료
          // ================================
          case 'UNAUTHORIZED':
            setError(
              '로그인이 만료되었습니다. 다시 로그인해주세요.'
            )

            break

          // ================================
          // 다른 사람 주문
          // ================================
          case 'FORBIDDEN':
            setError(
              '이 주문에 접근할 수 없습니다.'
            )

            break

          // ================================
          // 존재하지 않는 주문
          // ================================
          case 'ORDER_NOT_FOUND':
            setError(
              '주문 정보를 찾을 수 없습니다.'
            )

            break

          // ================================
          // 기타
          // ================================
          default:
            setError(
              apiError.message ||
                '도착 인증 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
            )
        }
      } finally {
        setIsSubmitting(
          false
        )
      }
    }

  // ========================================
  // Waiting 화면으로 이동
  //
  // 공통 주문 응답 전체를 넘김
  // ========================================
  const handleGoToWaiting =
    () => {
      if (
        !arrivalResult
      ) {
        return
      }

      onSuccess?.(
        arrivalResult
      )
    }

  // ========================================
  // 현장 인증 성공 화면
  // ========================================
  if (
    verified &&
    arrivalResult
  ) {
    const waitingNumber =
      arrivalResult
        .waitingNumber != null
        ? String(
            arrivalResult
              .waitingNumber
          ).padStart(
            3,
            '0'
          )
        : '---'

    return (
      <div className="arrival-verify-page">

        <header className="arrival-verify-header">

          <button
            type="button"
            className="arrival-back-button"
            onClick={() =>
              setVerified(
                false
              )
            }
            aria-label="뒤로가기"
          >
            ‹
          </button>

          <h2>
            현장 도착 인증
          </h2>

          <div className="arrival-header-space" />

        </header>

        <main className="arrival-success-content">

          <div className="arrival-success-icon">
            ✓
          </div>

          <h1>
            도착이 확인되었습니다
          </h1>

          <p className="arrival-success-description">
            대기번호가 발급되었고
            음식 조리를 시작할게요.
          </p>

          <div className="arrival-success-card">

            <span className="arrival-success-label">
              대기번호
            </span>

            <strong className="arrival-success-code">
              {waitingNumber}
            </strong>

            <div className="arrival-success-divider" />

            <p>
              {arrivalResult.storeName}
              에서 음식을 준비하고 있어요.
            </p>

          </div>

          <button
            type="button"
            className="waiting-number-button"
            onClick={
              handleGoToWaiting
            }
          >
            대기 현황 확인하기
          </button>

        </main>

      </div>
    )
  }

  // ========================================
  // 현장 번호 입력 화면
  // ========================================
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

        <h2>
          현장 도착 인증
        </h2>

        <div className="arrival-header-space" />

      </header>

      <main className="arrival-verify-content">

        <div className="arrival-store-icon">
          <span>
            ▱
          </span>
        </div>

        <h1>
          오늘의 현장 번호
        </h1>

        <p className="arrival-description">
          학생식당에 표시된 오늘의 번호를 입력해주세요.
        </p>

        <div className="arrival-code-inputs">

          {code.map(
            (
              number,
              index
            ) => (
              <input
                key={index}
                ref={(
                  element
                ) => {
                  inputRefs
                    .current[
                      index
                    ] =
                    element
                }}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={number}
                disabled={
                  isSubmitting
                }
                onChange={(
                  event
                ) =>
                  handleChange(
                    index,
                    event
                      .target
                      .value
                  )
                }
                onKeyDown={(
                  event
                ) =>
                  handleKeyDown(
                    index,
                    event
                  )
                }
                onPaste={
                  handlePaste
                }
                className={`arrival-code-input ${
                  error
                    ? 'error'
                    : ''
                }`}
                aria-label={`현장 번호 ${
                  index + 1
                }번째 자리`}
              />
            )
          )}

        </div>

        <div className="arrival-number-info">

          <span>
            ⓘ
          </span>

          <p>
            현장 번호는 대기번호와 다른 도착 인증용 번호예요.
          </p>

        </div>

        {error && (
          <div className="arrival-error-message">

            <span>
              !
            </span>

            <p>
              {error}
            </p>

          </div>
        )}

        <button
          type="button"
          className="arrival-confirm-button"
          disabled={
            !isComplete ||
            isSubmitting
          }
          onClick={
            handleVerify
          }
        >
          {isSubmitting
            ? '도착 확인 중...'
            : '도착 확인'}
        </button>

      </main>

    </div>
  )
}

export default ArrivalVerify
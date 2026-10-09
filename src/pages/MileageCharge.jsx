import {
  useEffect,
  useState,
} from 'react'

import {
  getMileage,
} from '../api/mileageApi'

function MileageCharge({
  currentMileage = 0,
  onBack,
  onCharge,
}) {
  const [
    mileage,
    setMileage,
  ] = useState(currentMileage)

  const [
    selectedAmount,
    setSelectedAmount,
  ] = useState(10000)

  const [
    customAmount,
    setCustomAmount,
  ] = useState('')

  const [
    isCustom,
    setIsCustom,
  ] = useState(false)

  const [
    isLoading,
    setIsLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')

  const amounts = [
    1000,
    5000,
    10000,
    20000,
    30000,
  ]

  // ======================================================
  // 현재 마일리지 조회
  // ======================================================

  useEffect(() => {
    let cancelled = false

    const loadMileage = async () => {
      try {
        setIsLoading(true)
        setError('')

        const data =
          await getMileage()

        if (cancelled) {
          return
        }

        setMileage(
          Number(data?.balance ?? 0)
        )
      } catch (error) {
        if (cancelled) {
          return
        }

        console.error(
          '마일리지 조회 실패:',
          error
        )

        // 백엔드 연결 전에는
        // App에서 전달받은 값을 유지
        setMileage(currentMileage)

        if (
          error.code === 'UNAUTHORIZED'
        ) {
          setError(
            '로그인이 필요합니다.'
          )
        } else {
          setError(
            '현재 잔액을 불러오지 못했습니다.'
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadMileage()

    return () => {
      cancelled = true
    }
  }, [currentMileage])

  // ======================================================
  // 금액 선택
  // ======================================================

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount)
    setIsCustom(false)
    setCustomAmount('')
  }

  const handleCustomClick = () => {
    setSelectedAmount(0)
    setIsCustom(true)
  }

  const handleCustomChange = (e) => {
    const value =
      e.target.value.replace(
        /[^0-9]/g,
        ''
      )

    setCustomAmount(value)
  }

  const finalAmount = isCustom
    ? Number(customAmount)
    : selectedAmount

  const isValidAmount =
    finalAmount >= 1000 &&
    finalAmount <= 100000

  // ======================================================
  // 결제 화면으로 이동
  // ======================================================

  const handleCharge = () => {
    if (!isValidAmount) {
      return
    }

    if (onCharge) {
      onCharge(finalAmount)
    }
  }

  return (
    <main className="mileage-charge-page">

      {/* 뒤로가기 */}

      <header className="charge-header">

        <button
          type="button"
          className="charge-back"
          onClick={onBack}
          aria-label="뒤로가기"
        >
          ‹
        </button>

      </header>

      {/* 현재 잔액 */}

      <section className="charge-balance-card">

        <p>현재 잔액</p>

        <strong>
          {isLoading
            ? '조회 중'
            : `${mileage.toLocaleString()}P`}
        </strong>

        {error && (
          <p>{error}</p>
        )}

      </section>

      {/* 충전 금액 선택 */}

      <section className="charge-section">

        <h2>
          충전 금액 선택
        </h2>

        <div className="charge-amount-grid">

          {amounts.map((amount) => (
            <button
              key={amount}
              type="button"
              className={
                !isCustom &&
                selectedAmount === amount
                  ? 'charge-amount-button selected'
                  : 'charge-amount-button'
              }
              onClick={() =>
                handleAmountClick(amount)
              }
            >
              {amount.toLocaleString()}P
            </button>
          ))}

          <button
            type="button"
            className={
              isCustom
                ? 'charge-amount-button selected'
                : 'charge-amount-button'
            }
            onClick={handleCustomClick}
          >
            직접 입력
          </button>

        </div>

        {isCustom && (
          <div className="custom-charge-area">

            <input
              type="text"
              inputMode="numeric"
              value={customAmount}
              onChange={
                handleCustomChange
              }
              placeholder="충전 금액 입력"
            />

            <span>P</span>

          </div>
        )}

        <p className="charge-limit">
          최소 1,000P · 최대 100,000P
        </p>

      </section>

      {/* 충전 버튼 */}

      <div className="charge-bottom">

        <button
          type="button"
          className="charge-submit"
          disabled={!isValidAmount}
          onClick={handleCharge}
        >
          {finalAmount > 0
            ? `${finalAmount.toLocaleString()}P 토스로 충전하기`
            : '충전 금액을 선택해주세요'}
        </button>

      </div>

    </main>
  )
}

export default MileageCharge

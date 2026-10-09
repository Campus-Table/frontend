import { useState } from 'react'

function MileageCharge({
  currentMileage = 4500,
  onBack,
  onCharge,
}) {
  const [selectedAmount, setSelectedAmount] = useState(10000)
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)

  const amounts = [
    1000,
    5000,
    10000,
    20000,
    30000,
  ]

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
    const value = e.target.value.replace(/[^0-9]/g, '')
    setCustomAmount(value)
  }

  const finalAmount = isCustom
    ? Number(customAmount)
    : selectedAmount

  const isValidAmount =
    finalAmount >= 1000 &&
    finalAmount <= 100000

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
          {currentMileage.toLocaleString()}P
        </strong>
      </section>

      {/* 충전 금액 선택 */}
      <section className="charge-section">

        <h2>충전 금액 선택</h2>

        <div className="charge-amount-grid">

          {amounts.map((amount) => (
            <button
              key={amount}
              type="button"
              className={
                !isCustom && selectedAmount === amount
                  ? 'charge-amount-button selected'
                  : 'charge-amount-button'
              }
              onClick={() => handleAmountClick(amount)}
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

        {/* 직접 입력 */}
        {isCustom && (
          <div className="custom-charge-area">
            <input
              type="text"
              inputMode="numeric"
              value={customAmount}
              onChange={handleCustomChange}
              placeholder="충전 금액 입력"
            />

            <span>P</span>
          </div>
        )}

        <p className="charge-limit">
          최소 1,000P · 최대 100,000P
        </p>

      </section>

      {/* 하단 충전 버튼 */}
      <div className="charge-bottom">
        <button
          type="button"
          className="charge-submit"
          disabled={!isValidAmount}
          onClick={() => onCharge(finalAmount)}
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
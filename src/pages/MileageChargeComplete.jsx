function MileageChargeComplete({
  chargeAmount,
  balance,
  onConfirm,
}) {
  return (
    <main className="charge-complete-page">

      <section className="charge-complete-content">

        <div className="charge-check">
          ✓
        </div>

        <h1>
          마일리지 충전이 완료됐어요
        </h1>

        <div className="charge-result-card">

          <div className="charge-result-row">

            <span>
              충전 금액
            </span>

            <strong className="charge-plus">
              +{Number(
                chargeAmount || 0
              ).toLocaleString()}P
            </strong>

          </div>

          <div className="charge-result-divider" />

          <div className="charge-result-row">

            <span>
              충전 후 잔액
            </span>

            <strong>
              {Number(
                balance || 0
              ).toLocaleString()}P
            </strong>

          </div>

        </div>

        <button
          type="button"
          className="charge-confirm-button"
          onClick={onConfirm}
        >
          확인
        </button>

      </section>

    </main>
  )
}

export default MileageChargeComplete 

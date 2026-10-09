function MileagePayment({
  currentMileage = 4500,
  chargeAmount,
  onPaymentComplete,
  onCancel,
}) {
  return (
    <main className="mileage-payment-page">

      {/* 현재 잔액 */}
      <section className="charge-balance-card">
        <p>현재 잔액</p>

        <strong>
          {currentMileage.toLocaleString()}P
        </strong>
      </section>

      {/* 토스 결제 진행 */}
      <section className="toss-payment-card">

        <div className="payment-loading-circle"></div>

        <h2>
          토스 결제를 진행하고 있어요
        </h2>

        <p>
          외부 결제창에서 결제를 완료해주세요.
        </p>

        {/* 실제 토스 연동 전 시연용 */}
        <button
          type="button"
          className="payment-demo-button"
          onClick={onPaymentComplete}
        >
          결제 완료 시연
        </button>

        <button
          type="button"
          className="payment-cancel-button"
          onClick={onCancel}
        >
          실패 상태 보기
        </button>

      </section>

    </main>
  )
}

export default MileagePayment  


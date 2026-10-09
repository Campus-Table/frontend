function OrderCancelComplete({
  refundMileage,
  onHome,
}) {
  return (
    <main className="order-cancel-complete-page">

      <section className="cancel-complete-content">

        <div className="cancel-complete-icon">
          ▤
        </div>

        <h1>
          주문이 취소됐어요
        </h1>

        <p className="cancel-complete-description">
          결제한 마일리지{' '}
          {Number(
            refundMileage || 0
          ).toLocaleString()}P가
          <br />
          100% 환불됐습니다.
        </p>

        <button
          type="button"
          className="cancel-complete-home-button"
          onClick={onHome}
        >
          홈으로
        </button>

      </section>

    </main>
  )
}

export default OrderCancelComplete 

function OrderCancelComplete({
  refundMileage,
  onHome,
}) {
  return (
    <main className="order-cancel-complete-page">

      <section className="cancel-complete-content">

      <div className="cancel-complete-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3Z" />
          <path d="M9.5 9.5l5 5" />
          <path d="M14.5 9.5l-5 5" />
        </svg>
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

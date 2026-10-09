function OrderCancelComplete({ refundMileage, onHome }) {
  return (
    <main className="order-cancel-complete-page">
      <section className="cancel-complete-content">

        <div className="cancel-complete-icon">
          ▤
        </div>

        <h1>주문이 취소됐어요</h1>

        <p className="cancel-complete-description">
          결제 금액의 50%인{' '}
          {Number(refundMileage).toLocaleString()}P가
          <br />
          마일리지로 환불됐습니다.
        </p>

        <button
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


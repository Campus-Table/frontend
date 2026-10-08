function Waiting({ order }) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '600px',
        minHeight: '100vh',
        margin: '0 auto',
        padding: '40px 25px 120px',
        boxSizing: 'border-box',
        background: '#f8faff',
      }}
    >
      <h1>내 주문</h1>

      <p>대기번호 화면 준비 중</p>

      {order && (
        <div>
          <strong>{order.storeName}</strong>
          <p>{order.menuName}</p>
        </div>
      )}
    </div>
  )
}

export default Waiting
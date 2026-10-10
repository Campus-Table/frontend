function BottomNav({
  active = 'home',
  onHome,
  onOrders,
  onNotifications,
  onMyPage,
}) {
  return (
    <nav className="bottom-nav">

      {/* 홈 */}
      <button
        type="button"
        className={`bottom-nav-item ${
          active === 'home' ? 'active' : ''
        }`}
        onClick={onHome}
      >
        <span className="bottom-nav-icon">
          <svg
            viewBox="0 0 24 24"
            width="25"
            height="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5.5 9.5V21h13V9.5" />
            <path d="M9.5 21v-6h5v6" />
          </svg>
        </span>

        <span>홈</span>
      </button>

      {/* 내 주문 */}
      <button
        type="button"
        className={`bottom-nav-item ${
          active === 'orders' ? 'active' : ''
        }`}
        onClick={onOrders}
      >
        <span className="bottom-nav-icon">
          <svg
            viewBox="0 0 24 24"
            width="25"
            height="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <rect
              x="5"
              y="4"
              width="14"
              height="17"
              rx="2"
            />
            <path d="M9 4V2.5h6V4" />
            <path d="M8.5 9h7" />
            <path d="M8.5 13h7" />
          </svg>
        </span>

        <span>내 주문</span>
      </button>

      {/* 알림 */}
      <button
        type="button"
        className={`bottom-nav-item ${
          active === 'notifications'
            ? 'active'
            : ''
        }`}
        onClick={onNotifications}
      >
        <span className="bottom-nav-icon">
          <svg
            viewBox="0 0 24 24"
            width="25"
            height="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
          </svg>
        </span>

        <span>알림</span>
      </button>

      {/* 마이페이지 */}
      <button
        type="button"
        className={`bottom-nav-item ${
          active === 'mypage' ? 'active' : ''
        }`}
        onClick={onMyPage}
      >
        <span className="bottom-nav-icon">
          <svg
            viewBox="0 0 24 24"
            width="25"
            height="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle
              cx="12"
              cy="8"
              r="4"
            />
            <path d="M4.5 21c.8-4.2 3.4-6.5 7.5-6.5s6.7 2.3 7.5 6.5" />
          </svg>
        </span>

        <span>마이</span>
      </button>

    </nav>
  )
}

export default BottomNav 
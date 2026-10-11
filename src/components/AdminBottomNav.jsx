function AdminBottomNav({
  active,
  onDashboard,
  onWaiting,
  onStats,
}) {
  return (
    <nav className="admin-bottom-nav">

      <button
        type="button"
        className={`admin-nav-item ${
          active === 'dashboard'
            ? 'active'
            : ''
        }`}
        onClick={onDashboard}
      >
        <span className="admin-nav-icon">
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

        <span>
          대시보드
        </span>
      </button>

      <button
        type="button"
        className={`admin-nav-item ${
          active === 'waiting'
            ? 'active'
            : ''
        }`}
        onClick={onWaiting}
      >
        <span className="admin-nav-icon">
          ◷
        </span>

        <span>
          대기 현황
        </span>
      </button>

      <button
        type="button"
        className={`admin-nav-item ${
          active === 'stats'
            ? 'active'
            : ''
        }`}
        onClick={onStats}
      >
        <span className="admin-nav-icon">
          ↗
        </span>

        <span>
          이용 현황
        </span>
      </button>

    </nav>
  )
}

export default AdminBottomNav
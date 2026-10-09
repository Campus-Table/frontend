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
          ⌂
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
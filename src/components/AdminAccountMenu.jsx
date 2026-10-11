import {
    useEffect,
    useRef,
    useState,
  } from 'react'
  
  function AdminAccountMenu({
    onLogout,
  }) {
    const [
      open,
      setOpen,
    ] = useState(false)
  
    const [
      loggingOut,
      setLoggingOut,
    ] = useState(false)
  
    const menuRef =
      useRef(null)
  
    // ========================================
    // 메뉴 바깥 클릭 시 닫기
    // ========================================
  
    useEffect(() => {
      const handleClickOutside =
        (event) => {
          if (
            menuRef.current &&
            !menuRef.current.contains(
              event.target
            )
          ) {
            setOpen(false)
          }
        }
  
      document.addEventListener(
        'mousedown',
        handleClickOutside
      )
  
      return () => {
        document.removeEventListener(
          'mousedown',
          handleClickOutside
        )
      }
    }, [])
  
    // ========================================
    // 관리자 로그아웃
    // ========================================
  
    const handleLogout =
      async () => {
        if (loggingOut) {
          return
        }
  
        try {
          setLoggingOut(true)
  
          await onLogout?.()
  
          setOpen(false)
        } finally {
          setLoggingOut(false)
        }
      }
  
    return (
      <div
        className="admin-account-menu"
        ref={menuRef}
      >
        <button
          type="button"
          className={`admin-badge admin-account-button ${
            open ? 'open' : ''
          }`}
          onClick={() =>
            setOpen(
              (previous) =>
                !previous
            )
          }
        >
          관리자
  
          <span
            className={`admin-account-arrow ${
              open ? 'open' : ''
            }`}
          >
            ▾
          </span>
        </button>
  
        {open && (
          <div className="admin-account-dropdown">
            <button
              type="button"
              className="admin-logout-menu-button"
              onClick={
                handleLogout
              }
              disabled={
                loggingOut
              }
            >
              {loggingOut
                ? '로그아웃 중...'
                : '로그아웃'}
            </button>
          </div>
        )}
      </div>
    )
  }
  
  export default AdminAccountMenu
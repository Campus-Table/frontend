function Login({
  onBack,
  onLogin,
  onSignup,
  onForgotPassword
}) {
  return (
    <main className="login-page">

      {/* 뒤로가기 */}
      <button
        className="login-back"
        onClick={onBack}
        aria-label="뒤로가기"
      >
        ‹
      </button>

      {/* 로고 */}
      <header className="login-brand">
        <div className="login-brand-icon">♙</div>
        <h1>Campus Table</h1>
      </header>

      {/* 로그인 소개 */}
      <section className="login-intro">
        <p className="login-label">WELCOME BACK</p>

        <h2>학교 구성원 로그인</h2>

        <p className="login-description">
          학번과 비밀번호를 입력해주세요.
        </p>
      </section>

      {/* 입력 영역 */}
      <section className="login-form">

        {/* 학번 */}
        <div className="input-group">
          <label htmlFor="student-number">학번</label>

          <input
            id="student-number"
            type="text"
            inputMode="numeric"
            placeholder="8자리 학번"
            maxLength="8"
          />
        </div>

        {/* 비밀번호 */}
        <div className="input-group">
          <label htmlFor="password">비밀번호</label>

          <input
            id="password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
          />
        </div>

        {/* 비밀번호 찾기 */}
        <div className="forgot-password-row">
          <button
            type="button"
            className="forgot-password-button"
            onClick={onForgotPassword}
          >
            비밀번호를 잊으셨나요?
          </button>
        </div>

        {/* 로그인 */}
        <button
          type="button"
          className="login-submit"
          onClick={onLogin}
        >
          로그인
        </button>

        {/* 안내 */}
        <div className="login-info">
          <span className="info-icon">ⓘ</span>

          <span>
            학번과 비밀번호를 입력하여 로그인해주세요.
          </span>
        </div>

        {/* 회원가입 */}
        <div className="signup-guide">
          <span>계정이 없으신가요?</span>

          <button
            type="button"
            className="signup-link"
            onClick={onSignup}
          >
            회원가입
          </button>
        </div>

      </section>

    </main>
  )
}

export default Login  
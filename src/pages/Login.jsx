function Login({ onBack, onLogin }) {
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

        <h2>학교 구성원 인증</h2>

        <p className="login-description">
          학교 이메일과 학번으로 간편하게 확인할게요.
        </p>
      </section>

      {/* 입력 영역 */}
      <section className="login-form">

        <div className="input-group">
          <label htmlFor="email">학교 이메일</label>

          <input
            id="email"
            type="email"
            placeholder="example@dankook.ac.kr"
          />
        </div>

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

        <button
          className="login-submit"
          onClick={onLogin}
        >
          로그인
        </button>

        <div className="login-info">
          <span className="info-icon">ⓘ</span>
          <span>
            학교 이메일과 학번을 통해 재학생 여부를 확인합니다.
          </span>
        </div>

        <button
          className="prototype-back"
          onClick={onBack}
        >
          프로토타입 바로 둘러보기
        </button>

      </section>

    </main>
  )
}

export default Login
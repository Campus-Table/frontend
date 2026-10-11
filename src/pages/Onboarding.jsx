import { useState } from 'react'
import utensilsIcon from '../assets/utensils.svg'

function Onboarding({ onLogin }) {
  const [showAbout, setShowAbout] = useState(false)

  const handleStart = () => {
    setShowAbout(false)
    onLogin()
  }

  return (
    <main className="landing">

      {/* Campus Table 로고 */}
      <header className="brand">
        <div className="brand-icon">
          <img
            src={utensilsIcon}
            alt="Campus Table 로고"
            className="brand-icon-image"
          />
        </div>
        <h1>Campus Table</h1>
      </header>

      {/* 혼잡도 그래프 */}
      <section className="crowd-graphic">
        <div className="bar">
          <div className="fill fill-1"></div>
        </div>

        <div className="bar">
          <div className="fill fill-2"></div>
        </div>

        <div className="bar">
          <div className="fill fill-3"></div>
        </div>

        <div className="bar">
          <div className="fill fill-4"></div>
        </div>

        <div className="bar">
          <div className="fill fill-5"></div>
        </div>
      </section>

      {/* 소개 문구 */}
      <section className="intro">
        <div className="badge">
          ✧ 캠퍼스의 더 여유로운 한 끼
        </div>

        <h2>
          줄 서는 시간은 줄이고,
          <br />
          <span>식사 시간은 여유롭게.</span>
        </h2>

        <p>
          학식당에 가기 전 혼잡도를 확인하고
          <br />
          원하는 메뉴를 미리 주문하세요.
        </p>
      </section>

      {/* 하단 버튼 */}
      <section className="actions">
        <button
          className="login-button"
          onClick={onLogin}
        >
          로그인
        </button>

        <button
          className="about-button"
          onClick={() => setShowAbout(true)}
        >
          Campus Table이란?
        </button>
      </section>

      {/* Campus Table 소개 모달 */}
      {showAbout && (
        <div
          className="modal-overlay"
          onClick={() => setShowAbout(false)}
        >
          <div
            className="about-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={() => setShowAbout(false)}
              aria-label="닫기"
            >
              ×
            </button>

            <p className="about-label">
              ABOUT
            </p>

            <h2 className="about-title">
              식당 앞에서 기다리지 마세요
            </h2>

            <div className="feature-list">

              <div className="feature-item">
                <div className="feature-icon">♧</div>

                <div className="feature-text">
                  <h3>학식당 전체 혼잡도 확인</h3>
                  <p>방문 전에 현재 이용 인원을 확인해요.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">▤</div>

                <div className="feature-text">
                  <h3>메뉴 미리 주문 · 결제</h3>
                  <p>키오스크 줄 없이 미리 디지털로 결제해요.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">✓</div>

                <div className="feature-text">
                  <h3>현장 인증 후 대기번호 발급</h3>
                  <p>도착한 순간부터 조리가 시작돼요.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">♢</div>

                <div className="feature-text">
                  <h3>예상 시간 및 수령 알림</h3>
                  <p>음식 준비 예상 시간을 놓치지 않아요.</p>
                </div>
              </div>

            </div>

            <button
              className="start-button"
              onClick={handleStart}
            >
              시작하기
            </button>

          </div>
        </div>
      )}

    </main>
  )
}

export default Onboarding

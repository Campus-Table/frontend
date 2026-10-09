import { useState } from 'react'
import './App.css'

// ========================================
// 학생 화면
// ========================================

import Onboarding from './pages/Onboarding'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import StudentHome from './pages/StudentHome'
import StoreDetail from './pages/StoreDetail'
import OrderPayment from './pages/OrderPayment'
import OrderComplete from './pages/OrderComplete'
import ArrivalVerify from './pages/ArrivalVerify'
import Waiting from './pages/Waiting'
import Notifications from './pages/Notifications'

// ========================================
// 마일리지 충전 화면
// ========================================

import MileageCharge from './pages/MileageCharge'
import MileagePayment from './pages/MileagePayment'
import MileageChargeComplete from './pages/MileageChargeComplete'

// ========================================
// 관리자 화면
// ========================================

import AdminDashboard from './pages/AdminDashboard'
import AdminWaiting from './pages/AdminWaiting'
import AdminStats from './pages/AdminStats'
import AdminOccupancy from './pages/AdminOccupancy'

// ========================================
// 하단 네비게이션
// ========================================

import BottomNav from './components/BottomNav'
import AdminBottomNav from './components/AdminBottomNav'

// ========================================
// 관리자 화면 임시 확인용
//
// true  = 관리자 화면부터 시작
// false = 학생 서비스부터 시작
//
// 추후 로그인 권한(USER / ADMIN)에 따라
// 자동 분기하도록 변경 예정
// ========================================

const ADMIN_PREVIEW = true

function App() {
  // ========================================
  // 현재 페이지
  // ========================================

  const [page, setPage] = useState(
    ADMIN_PREVIEW
      ? 'adminDashboard'
      : 'onboarding'
  )

  // ========================================
  // 선택한 가게 / 주문
  // ========================================

  const [selectedStore, setSelectedStore] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // ========================================
  // 마일리지
  //
  // 현재는 화면 구현을 위한 임시 데이터
  // 추후 서버 API 값으로 교체
  // ========================================

  const [mileage, setMileage] = useState(4500)

  // 사용자가 선택한 충전 금액
  const [chargeAmount, setChargeAmount] = useState(0)

  // ========================================
  // 주문 진행 상태
  //
  // none    = 주문 없음
  // paid    = 결제 완료 / 현장 인증 전
  // waiting = 현장 인증 완료 / 조리 중
  // ========================================

  const [orderStatus, setOrderStatus] = useState('none')

  // ========================================
  // 학생 하단 네비게이션
  // ========================================

  const goHome = () => {
    setPage('home')
  }

  const goOrders = () => {
    // 현장 인증 완료 / 대기번호 확인
    if (
      selectedOrder &&
      orderStatus === 'waiting'
    ) {
      setPage('waiting')
      return
    }

    // 결제 완료 / 현장 인증 전
    if (
      selectedOrder &&
      orderStatus === 'paid'
    ) {
      setPage('orderComplete')
      return
    }

    // 주문이 없는 경우
    setPage('home')
  }

  const goNotifications = () => {
    setPage('notifications')
  }

  // ========================================
  // 관리자 하단 네비게이션
  // ========================================

  const goAdminDashboard = () => {
    setPage('adminDashboard')
  }

  const goAdminWaiting = () => {
    setPage('adminWaiting')
  }

  const goAdminStats = () => {
    setPage('adminStats')
  }

  // ========================================
  // 관리자 인원 현황 관리
  // ========================================

  const goAdminOccupancy = () => {
    setPage('adminOccupancy')
  }

  // ========================================
  // 현재 페이지 렌더링
  // ========================================

  let content

  // ========================================
  // 관리자 대시보드
  // ========================================

  if (page === 'adminDashboard') {
    content = (
      <AdminDashboard
        onWaiting={goAdminWaiting}
        onOccupancy={goAdminOccupancy}
      />
    )
  }

  // ========================================
  // 관리자 웨이팅
  // ========================================

  else if (page === 'adminWaiting') {
    content = (
      <AdminWaiting />
    )
  }

  // ========================================
  // 관리자 통계
  // ========================================

  else if (page === 'adminStats') {
    content = (
      <AdminStats />
    )
  }

  // ========================================
  // 관리자 인원 현황
  // ========================================

  else if (page === 'adminOccupancy') {
    content = (
      <AdminOccupancy
        onBack={() => setPage('adminDashboard')}
      />
    )
  }

  // ========================================
  // 로그인
  // ========================================

  else if (page === 'login') {
    content = (
      <Login
        onBack={() => setPage('onboarding')}
        onLogin={() => setPage('home')}
        onSignup={() => setPage('signup')}
        onForgotPassword={() => setPage('forgotPassword')}
      />
    )
  }

  // ========================================
  // 회원가입
  // ========================================

  else if (page === 'signup') {
    content = (
      <Signup
        onBack={() => setPage('login')}
        onSignupComplete={() => setPage('login')}
      />
    )
  }

  // ========================================
  // 비밀번호 찾기 / 재설정
  // ========================================

  else if (page === 'forgotPassword') {
    content = (
      <ForgotPassword
        onBack={() => setPage('login')}
        onComplete={() => setPage('login')}
      />
    )
  }

  // ========================================
  // 학생 홈
  // ========================================

  else if (page === 'home') {
    content = (
      <StudentHome
        onStore={(storeId) => {
          setSelectedStore(storeId)
          setPage('store')
        }}
        onOrders={goOrders}
        onNotifications={goNotifications}
      />
    )
  }

  // ========================================
  // 가게 상세 / 메뉴 선택
  // ========================================

  else if (page === 'store') {
    content = (
      <StoreDetail
        storeId={selectedStore}

        onBack={() => {
          setPage('home')
        }}

        onOrder={(order) => {
          // 여기서는 결제하지 않음
          // 선택한 메뉴만 저장

          setSelectedOrder(order)

          // 주문 결제 화면으로 이동

          setPage('orderPayment')
        }}
      />
    )
  }

  // ========================================
  // 주문 마일리지 결제
  // ========================================

  else if (page === 'orderPayment') {
    content = (
      <OrderPayment
        order={selectedOrder}
        mileage={mileage}

        // 뒤로가기 -> 가게 상세

        onBack={() => {
          setPage('store')
        }}

        // 마일리지 충전하기

        onCharge={() => {
          setPage('mileageCharge')
        }}

        // 주문 결제

        onPayment={() => {
          if (!selectedOrder) {
            return
          }

          const price =
            Number(selectedOrder.price || 0)

          // 마일리지 부족

          if (mileage < price) {
            alert('마일리지가 부족합니다.')
            return
          }

          // 마일리지 차감

          setMileage(
            (previousMileage) =>
              previousMileage - price
          )

          // 주문 상태 변경

          setOrderStatus('paid')

          // 주문 완료 화면

          setPage('orderComplete')
        }}
      />
    )
  }

  // ========================================
  // 마일리지 충전 금액 선택
  // ========================================

  else if (page === 'mileageCharge') {
    content = (
      <MileageCharge
        currentMileage={mileage}

        // 뒤로가기 -> 주문 결제

        onBack={() => {
          setPage('orderPayment')
        }}

        // 충전 금액 선택 완료

        onCharge={(amount) => {
          // 선택한 금액 저장

          setChargeAmount(amount)

          // 토스 결제 화면으로 이동

          setPage('mileagePayment')
        }}
      />
    )
  }

  // ========================================
  // 토스 결제 진행
  // ========================================

  else if (page === 'mileagePayment') {
    content = (
      <MileagePayment
        currentMileage={mileage}
        chargeAmount={chargeAmount}

        // 현재는 실제 토스 연동 전
        // 결제 성공을 화면상으로 시연

        onPaymentComplete={() => {
          // 마일리지 충전

          setMileage(
            (previousMileage) =>
              previousMileage + chargeAmount
          )

          // 충전 완료 화면

          setPage('mileageChargeComplete')
        }}

        // 결제 취소 / 실패

        onCancel={() => {
          setPage('mileageCharge')
        }}
      />
    )
  }

  // ========================================
  // 마일리지 충전 완료
  // ========================================

  else if (page === 'mileageChargeComplete') {
    content = (
      <MileageChargeComplete
        // 충전 전 마일리지

        previousMileage={
          mileage - chargeAmount
        }

        chargeAmount={chargeAmount}

        // 확인 -> 원래 주문 결제 화면

        onConfirm={() => {
          setPage('orderPayment')
        }}
      />
    )
  }

  // ========================================
  // 주문 완료
  // ========================================

  else if (page === 'orderComplete') {
    content = (
      <OrderComplete
        order={selectedOrder}

        onVerify={() => {
          setPage('arrivalVerify')
        }}
      />
    )
  }

  // ========================================
  // 현장 방문 인증
  // ========================================

  else if (page === 'arrivalVerify') {
    content = (
      <ArrivalVerify
        onBack={() => {
          setPage('orderComplete')
        }}

        onSuccess={() => {
          setOrderStatus('waiting')

          setPage('waiting')
        }}
      />
    )
  }

  // ========================================
  // 대기번호 / 조리 중
  // ========================================

  else if (page === 'waiting') {
    content = (
      <Waiting
        order={selectedOrder}
      />
    )
  }

  // ========================================
  // 알림
  // ========================================

  else if (page === 'notifications') {
    content = (
      <Notifications
        order={selectedOrder}
        orderStatus={orderStatus}
      />
    )
  }

  // ========================================
  // 처음 실행 -> 온보딩
  // ========================================

  else {
    content = (
      <Onboarding
        onLogin={() => {
          setPage('login')
        }}
      />
    )
  }

  // ========================================
  // 관리자 페이지인지 확인
  // ========================================

  const isAdminPage =
    page === 'adminDashboard' ||
    page === 'adminWaiting' ||
    page === 'adminStats' ||
    page === 'adminOccupancy'

  // ========================================
  // 학생 하단바 표시 여부
  //
  // 아래 화면에서는 숨김
  // - 온보딩
  // - 로그인
  // - 회원가입
  // - 비밀번호 찾기
  // - 주문 결제
  // - 마일리지 충전
  // - 토스 결제
  // - 충전 완료
  // ========================================

  const showBottomNav =
    page !== 'onboarding' &&
    page !== 'login' &&
    page !== 'signup' &&
    page !== 'forgotPassword' &&
    page !== 'orderPayment' &&
    page !== 'mileageCharge' &&
    page !== 'mileagePayment' &&
    page !== 'mileageChargeComplete'

  // ========================================
  // 관리자 하단바 표시 여부
  //
  // 관리자 인원 현황 화면에서는 숨김
  // ========================================

  const showAdminBottomNav =
    isAdminPage &&
    page !== 'adminOccupancy'

  // ========================================
  // 학생 하단 네비게이션 활성 메뉴
  // ========================================

  let activeNav = 'orders'

  // 홈 / 가게 상세

  if (
    page === 'home' ||
    page === 'store'
  ) {
    activeNav = 'home'
  }

  // 알림

  if (page === 'notifications') {
    activeNav = 'notifications'
  }

  // 주문 관련 화면

  if (
    page === 'orderPayment' ||
    page === 'mileageCharge' ||
    page === 'mileagePayment' ||
    page === 'mileageChargeComplete' ||
    page === 'orderComplete' ||
    page === 'arrivalVerify' ||
    page === 'waiting'
  ) {
    activeNav = 'orders'
  }

  // ========================================
  // 관리자 하단 네비게이션 활성 메뉴
  // ========================================

  let activeAdminNav = 'dashboard'

  if (page === 'adminWaiting') {
    activeAdminNav = 'waiting'
  }

  if (page === 'adminStats') {
    activeAdminNav = 'stats'
  }

  // ========================================
  // 최종 화면 출력
  // ========================================

  return (
    <>
      <div
        className={
          showBottomNav && !isAdminPage
            ? 'student-page-with-nav'
            : ''
        }
      >
        {content}
      </div>

      {/* 학생 하단 네비게이션 */}
      {showBottomNav && !isAdminPage && (
        <BottomNav
          active={activeNav}
          onHome={goHome}
          onOrders={goOrders}
          onNotifications={goNotifications}
        />
      )}

      {/* 관리자 하단 네비게이션 */}
      {showAdminBottomNav && (
        <AdminBottomNav
          active={activeAdminNav}
          onDashboard={goAdminDashboard}
          onWaiting={goAdminWaiting}
          onStats={goAdminStats}
        />
      )}
    </>
  )
}

export default App
import { useState } from 'react'
import './App.css'

import Onboarding from './pages/Onboarding'
import Login from './pages/Login'
import StudentHome from './pages/StudentHome'
import StoreDetail from './pages/StoreDetail'
import OrderComplete from './pages/OrderComplete'
import ArrivalVerify from './pages/ArrivalVerify'
import Waiting from './pages/Waiting'
import Notifications from './pages/Notifications'

// =========================
// 관리자 화면 추가
// =========================
import AdminDashboard from './pages/AdminDashboard'
import AdminWaiting from './pages/AdminWaiting'
import AdminStats from './pages/AdminStats'

import BottomNav from './components/BottomNav'

// 관리자 하단 네비게이션 추가
import AdminBottomNav from './components/AdminBottomNav'

// =========================
// 관리자 화면 임시 확인용
//
// true  → 관리자 화면부터 시작
// false → 기존 학생 서비스 그대로 시작
// =========================
const ADMIN_PREVIEW = false

function App() {
  const [page, setPage] = useState(
    ADMIN_PREVIEW
      ? 'adminDashboard'
      : 'onboarding'
  )

  const [selectedStore, setSelectedStore] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // 주문 진행 상태
  // none = 주문 없음
  // paid = 선주문 완료 / 현장 인증 전
  // waiting = 현장 인증 완료 / 조리 중
  const [orderStatus, setOrderStatus] = useState('none')

  // =========================
  // 하단 네비게이션
  // =========================

  const goHome = () => {
    setPage('home')
  }

  const goOrders = () => {
    // 현장 인증 완료 → 대기번호/조리 화면
    if (selectedOrder && orderStatus === 'waiting') {
      setPage('waiting')
      return
    }

    // 선주문 완료 / 현장 인증 전
    if (selectedOrder && orderStatus === 'paid') {
      setPage('orderComplete')
      return
    }

    // 주문이 없는 경우
    setPage('home')
  }

  const goNotifications = () => {
    setPage('notifications')
  }

  // =========================
  // 관리자 하단 네비게이션
  // =========================

  const goAdminDashboard = () => {
    setPage('adminDashboard')
  }

  const goAdminWaiting = () => {
    setPage('adminWaiting')
  }

  const goAdminStats = () => {
    setPage('adminStats')
  }

  // =========================
  // 현재 페이지
  // =========================

  let content

  // =========================
  // 관리자 화면
  // =========================

  if (page === 'adminDashboard') {
    content = (
      <AdminDashboard
        onWaiting={goAdminWaiting}
      />
    )
  }

  else if (page === 'adminWaiting') {
    content = (
      <AdminWaiting />
    )
  }

  else if (page === 'adminStats') {
    content = (
      <AdminStats />
    )
  }

  // =========================
  // 학생 화면
  // =========================

  // 로그인
  else if (page === 'login') {
    content = (
      <Login
        onBack={() => setPage('onboarding')}
        onLogin={() => setPage('home')}
      />
    )
  }

  // 홈
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

  // 가게 상세 / 메뉴 선택
  else if (page === 'store') {
    content = (
      <StoreDetail
        storeId={selectedStore}
        onBack={() => setPage('home')}
        onOrder={(order) => {
          const mileage = 15000
          const remainingMileage = mileage - order.price

          // 마일리지가 부족한 경우
          if (remainingMileage < 0) {
            alert('마일리지가 부족합니다.')
            return
          }

          // 선주문 버튼을 누르는 순간 마일리지 결제 처리
          const paidOrder = {
            ...order,
            usedMileage: order.price,
            remainingMileage,
          }

          setSelectedOrder(paidOrder)
          setOrderStatus('paid')
          setPage('orderComplete')
        }}
      />
    )
  }

  // 선주문 완료
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

  // 현장 도착 인증
  else if (page === 'arrivalVerify') {
    content = (
      <ArrivalVerify
        onBack={() => setPage('orderComplete')}
        onSuccess={() => {
          setOrderStatus('waiting')
          setPage('waiting')
        }}
      />
    )
  }

  // 대기번호 / 조리 중
  else if (page === 'waiting') {
    content = (
      <Waiting
        order={selectedOrder}
      />
    )
  }

  // 알림
  else if (page === 'notifications') {
    content = (
      <Notifications
        order={selectedOrder}
        orderStatus={orderStatus}
      />
    )
  }

  // 처음 실행 → 온보딩
  else {
    content = (
      <Onboarding
        onLogin={() => setPage('login')}
      />
    )
  }

  // =========================
  // 관리자 페이지인지 확인
  // =========================

  const isAdminPage =
    page === 'adminDashboard' ||
    page === 'adminWaiting' ||
    page === 'adminStats'

  // =========================
  // 로그인 이후 항상 하단바 표시
  // =========================

  const showBottomNav =
    page !== 'onboarding' &&
    page !== 'login'

  // =========================
  // 현재 활성화된 학생 하단 메뉴
  // =========================

  let activeNav = 'orders'

  // 홈 / 가게 상세
  if (page === 'home' || page === 'store') {
    activeNav = 'home'
  }

  // 알림
  if (page === 'notifications') {
    activeNav = 'notifications'
  }

  // =========================
  // 현재 활성화된 관리자 하단 메뉴
  // =========================

  let activeAdminNav = 'dashboard'

  if (page === 'adminWaiting') {
    activeAdminNav = 'waiting'
  }

  if (page === 'adminStats') {
    activeAdminNav = 'stats'
  }

  // =========================
  // 화면 출력
  // =========================

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

      {/* 기존 학생 하단 네비게이션 */}
      {showBottomNav && !isAdminPage && (
        <BottomNav
          active={activeNav}
          onHome={goHome}
          onOrders={goOrders}
          onNotifications={goNotifications}
        />
      )}

      {/* 관리자 하단 네비게이션 */}
      {isAdminPage && (
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
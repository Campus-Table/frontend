import { useState } from 'react'
import './App.css'

import Onboarding from './pages/Onboarding'
import Login from './pages/Login'
import StudentHome from './pages/StudentHome'
import StoreDetail from './pages/StoreDetail'
import OrderConfirm from './pages/OrderConfirm'
import OrderComplete from './pages/OrderComplete'
import ArrivalVerify from './pages/ArrivalVerify'
import Waiting from './pages/Waiting'

import BottomNav from './components/BottomNav'

function App() {
  const [page, setPage] = useState('onboarding')

  const [selectedStore, setSelectedStore] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // 주문 진행 상태
  // none = 주문 없음
  // paid = 결제 완료 / 현장 인증 전
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

    // 결제 완료 / 현장 인증 전
    if (selectedOrder && orderStatus === 'paid') {
      setPage('orderComplete')
      return
    }

    // 메뉴 선택 후 결제 전
    if (selectedOrder) {
      setPage('orderConfirm')
      return
    }

    // 주문이 없는 경우
    setPage('home')
  }

  const goNotifications = () => {
    setPage('notifications')
  }

  // =========================
  // 현재 페이지
  // =========================

  let content

  if (page === 'login') {
    content = (
      <Login
        onBack={() => setPage('onboarding')}
        onLogin={() => setPage('home')}
      />
    )
  } else if (page === 'home') {
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
  } else if (page === 'store') {
    content = (
      <StoreDetail
        storeId={selectedStore}
        onBack={() => setPage('home')}
        onOrder={(order) => {
          setSelectedOrder(order)
          setOrderStatus('none')
          setPage('orderConfirm')
        }}
      />
    )
  } else if (page === 'orderConfirm') {
    content = (
      <OrderConfirm
        order={selectedOrder}
        onBack={() => setPage('store')}
        onPay={(order) => {
          setSelectedOrder(order)
          setOrderStatus('paid')
          setPage('orderComplete')
        }}
      />
    )
  } else if (page === 'orderComplete') {
    content = (
      <OrderComplete
        order={selectedOrder}
        onVerify={() => {
          setPage('arrivalVerify')
        }}
      />
    )
  } else if (page === 'arrivalVerify') {
    content = (
      <ArrivalVerify
        onBack={() => setPage('orderComplete')}
        onSuccess={() => {
          setOrderStatus('waiting')
          setPage('waiting')
        }}
      />
    )
  } else if (page === 'waiting') {
    content = (
      <Waiting
        order={selectedOrder}
      />
    )
  } else if (page === 'notifications') {
    content = (
      <div className="temporary-notification-page">
        <h1>알림</h1>
        <p>알림 화면을 다음 단계에서 연결할게요.</p>
      </div>
    )
  } else {
    content = (
      <Onboarding
        onLogin={() => setPage('login')}
      />
    )
  }

  // =========================
  // 로그인 이후 항상 하단바 표시
  // =========================

  const showBottomNav =
    page !== 'onboarding' &&
    page !== 'login'

  // 현재 활성화할 하단 메뉴
  let activeNav = 'orders'

  if (page === 'home' || page === 'store') {
    activeNav = 'home'
  }

  if (page === 'notifications') {
    activeNav = 'notifications'
  }

  return (
    <>
      <div className={showBottomNav ? 'student-page-with-nav' : ''}>
        {content}
      </div>

      {showBottomNav && (
        <BottomNav
          active={activeNav}
          onHome={goHome}
          onOrders={goOrders}
          onNotifications={goNotifications}
        />
      )}
    </>
  )
}

export default App
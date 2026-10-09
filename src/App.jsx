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

import OrderConfirm from './pages/OrderConfirm'
import OrderComplete from './pages/OrderComplete'
import OrderCancelComplete from './pages/OrderCancelComplete'

import ArrivalVerify from './pages/ArrivalVerify'
import Waiting from './pages/Waiting'
import FoodReady from './pages/FoodReady'
import Notifications from './pages/Notifications'

// ========================================
// 마일리지 충전
// ========================================

import MileageCharge from './pages/MileageCharge'
import MileagePayment from './pages/MileagePayment'
import MileageChargeComplete from './pages/MileageChargeComplete'

// ========================================
// 관리자
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
// API
// ========================================

import {
  getCurrentOrder,
} from './api/orderApi'

import {
  getMileage,
} from './api/mileageApi'

function App() {
  // ========================================
  // 현재 페이지
  // ========================================

  const [
    page,
    setPage,
  ] = useState('onboarding')

  // ========================================
  // 로그인 사용자
  // ========================================

  const [
    currentUser,
    setCurrentUser,
  ] = useState(null)

  // ========================================
  // 선택한 가게
  // ========================================

  const [
    selectedStore,
    setSelectedStore,
  ] = useState(null)

  // ========================================
  // 현재 선택 / 진행 주문
  // ========================================

  const [
    selectedOrder,
    setSelectedOrder,
  ] = useState(null)

  // ========================================
  // 마일리지
  // ========================================

  const [
    mileage,
    setMileage,
  ] = useState(0)

  // ========================================
  // 충전 금액
  // ========================================

  const [
    chargeAmount,
    setChargeAmount,
  ] = useState(0)

  // ========================================
  // 주문 취소 환불 표시 금액
  // ========================================

  const [
    refundMileage,
    setRefundMileage,
  ] = useState(0)

  // ========================================
  // 학생 홈
  // ========================================

  const goHome = () => {
    setPage('home')
  }

  // ========================================
  // 내 주문
  //
  // 로컬 상태가 아니라 서버에서
  // 현재 진행 중인 주문을 다시 조회
  // ========================================

  const goOrders = async () => {
    try {
      const currentOrder =
        await getCurrentOrder()

      // 진행 중 주문 없음
      if (!currentOrder) {
        setSelectedOrder(null)
        setPage('home')
        return
      }

      setSelectedOrder(
        currentOrder
      )

      // ====================================
      // 결제 완료 / 현장 인증 전
      // ====================================

      if (
        currentOrder.status ===
        'PAID'
      ) {
        setPage(
          'orderComplete'
        )
        return
      }

      // ====================================
      // 도착 인증 완료 / 조리 중
      // ====================================

      if (
        currentOrder.status ===
        'COOKING'
      ) {
        setPage('waiting')
        return
      }

      // ====================================
      // 혹시 서버에서 RECEIVED가 반환된 경우
      // ====================================

      if (
        currentOrder.status ===
        'RECEIVED'
      ) {
        setPage('foodReady')
        return
      }

      setPage('home')
    } catch (error) {
      console.error(
        '현재 주문 조회 실패:',
        error
      )

      if (
        error.code ===
        'UNAUTHORIZED'
      ) {
        alert(
          '로그인이 만료되었습니다. 다시 로그인해주세요.'
        )

        setCurrentUser(null)
        setSelectedOrder(null)
        setPage('login')
        return
      }

      alert(
        error.message ||
          '주문 정보를 불러오지 못했습니다.'
      )
    }
  }

  // ========================================
  // 알림
  // ========================================

  const goNotifications = () => {
    setPage('notifications')
  }

  // ========================================
  // 관리자 네비게이션
  // ========================================

  const goAdminDashboard = () => {
    setPage(
      'adminDashboard'
    )
  }

  const goAdminWaiting = () => {
    setPage(
      'adminWaiting'
    )
  }

  const goAdminStats = () => {
    setPage(
      'adminStats'
    )
  }

  const goAdminOccupancy = () => {
    setPage(
      'adminOccupancy'
    )
  }

  // ========================================
  // 화면 렌더링
  // ========================================

  let content

  // ========================================
  // 관리자 대시보드
  // ========================================

  if (
    page ===
    'adminDashboard'
  ) {
    content = (
      <AdminDashboard
        onWaiting={
          goAdminWaiting
        }
        onOccupancy={
          goAdminOccupancy
        }
      />
    )
  }

  // ========================================
  // 관리자 웨이팅
  // ========================================

  else if (
    page ===
    'adminWaiting'
  ) {
    content = (
      <AdminWaiting />
    )
  }

  // ========================================
  // 관리자 통계
  // ========================================

  else if (
    page ===
    'adminStats'
  ) {
    content = (
      <AdminStats />
    )
  }

  // ========================================
  // 관리자 인원 현황
  // ========================================

  else if (
    page ===
    'adminOccupancy'
  ) {
    content = (
      <AdminOccupancy
        onBack={() => {
          setPage(
            'adminDashboard'
          )
        }}
      />
    )
  }

  // ========================================
  // 로그인
  // ========================================

  else if (
    page === 'login'
  ) {
    content = (
      <Login
        onBack={() => {
          setPage(
            'onboarding'
          )
        }}

        onLogin={(user) => {
          setCurrentUser(user)

          // ================================
          // 관리자
          // ================================

          if (
            user?.role ===
            'ADMIN'
          ) {
            setPage(
              'adminDashboard'
            )
            return
          }

          // ================================
          // 일반 사용자
          // ================================

          setPage('home')
        }}

        onSignup={() => {
          setPage('signup')
        }}

        onForgotPassword={() => {
          setPage(
            'forgotPassword'
          )
        }}
      />
    )
  }

  // ========================================
  // 회원가입
  // ========================================

  else if (
    page === 'signup'
  ) {
    content = (
      <Signup
        onBack={() => {
          setPage('login')
        }}

        onSignupComplete={() => {
          setPage('login')
        }}
      />
    )
  }

  // ========================================
  // 비밀번호 찾기
  // ========================================

  else if (
    page ===
    'forgotPassword'
  ) {
    content = (
      <ForgotPassword
        onBack={() => {
          setPage('login')
        }}

        onComplete={() => {
          setPage('login')
        }}
      />
    )
  }

  // ========================================
  // 학생 홈
  // ========================================

  else if (
    page === 'home'
  ) {
    content = (
      <StudentHome
        onStore={(storeId) => {
          setSelectedStore(
            storeId
          )

          setPage('store')
        }}

        onOrders={
          goOrders
        }

        onNotifications={
          goNotifications
        }
      />
    )
  }

  // ========================================
  // 가게 상세
  // ========================================

  else if (
    page === 'store'
  ) {
    content = (
      <StoreDetail
        storeId={
          selectedStore
        }

        onBack={() => {
          setPage('home')
        }}

        onOrder={(order) => {
          setSelectedOrder(
            order
          )

          setPage(
            'orderConfirm'
          )
        }}
      />
    )
  }

  // ========================================
  // 주문 확인 + 마일리지 결제
  //
  // 실제 POST /api/orders는
  // OrderConfirm에서 실행
  // ========================================

  else if (
    page ===
    'orderConfirm'
  ) {
    content = (
      <OrderConfirm
        order={
          selectedOrder
        }

        onBack={() => {
          setPage('store')
        }}

        onPay={(
          createdOrder
        ) => {
          // 서버에서 반환한
          // 실제 주문 정보 저장

          setSelectedOrder(
            createdOrder
          )

          setPage(
            'orderComplete'
          )
        }}
      />
    )
  }

  // ========================================
  // 마일리지 충전 금액 선택
  // ========================================

  else if (
    page ===
    'mileageCharge'
  ) {
    content = (
      <MileageCharge
        currentMileage={
          mileage
        }

        onBack={() => {
          setPage(
            'orderConfirm'
          )
        }}

        onCharge={(amount) => {
          setChargeAmount(
            amount
          )

          setPage(
            'mileagePayment'
          )
        }}
      />
    )
  }

  // ========================================
  // 토스 결제
  // ========================================

  else if (
    page ===
    'mileagePayment'
  ) {
    content = (
      <MileagePayment
        currentMileage={
          mileage
        }

        chargeAmount={
          chargeAmount
        }

        onPaymentComplete={async (
          paymentResult
        ) => {
          // ==================================
          // 현재 MileagePayment가
          // 실제 토스 승인까지 완료했다면
          // 최신 서버 잔액을 다시 조회
          // ==================================

          try {
            if (
              paymentResult?.balance !=
              null
            ) {
              setMileage(
                Number(
                  paymentResult.balance
                )
              )
            } else {
              const result =
                await getMileage()

              setMileage(
                Number(
                  result?.balance ??
                    0
                )
              )
            }
          } catch (error) {
            console.error(
              '충전 후 마일리지 조회 실패:',
              error
            )
          }

          setPage(
            'mileageChargeComplete'
          )
        }}

        onCancel={() => {
          setPage(
            'mileageCharge'
          )
        }}
      />
    )
  }

  // ========================================
  // 마일리지 충전 완료
  // ========================================

  else if (
    page ===
    'mileageChargeComplete'
  ) {
    content = (
      <MileageChargeComplete
        chargeAmount={
          chargeAmount
        }

        balance={
          mileage
        }

        onConfirm={() => {
          setPage(
            'orderConfirm'
          )
        }}
      />
    )
  }

  // ========================================
  // 주문 완료
  //
  // PAID 상태
  // ========================================

  else if (
    page ===
    'orderComplete'
  ) {
    content = (
      <OrderComplete
        order={
          selectedOrder
        }

        // ================================
        // 현장 도착 인증
        // ================================

        onVerify={() => {
          setPage(
            'arrivalVerify'
          )
        }}

        // ================================
        // 주문 취소 성공
        //
        // OrderComplete 내부에서
        // cancelOrder API 호출 후
        // 취소된 주문 객체를 넘겨줌
        // ================================

        onCancel={async (
          cancelledOrder
        ) => {
          setSelectedOrder(
            cancelledOrder
          )

          // 최신 마일리지 조회
          // 서버에서 이미 100% 환불 처리됨

          try {
            const result =
              await getMileage()

            const newBalance =
              Number(
                result?.balance ??
                  0
              )

            setMileage(
              newBalance
            )
          } catch (error) {
            console.error(
              '취소 후 마일리지 조회 실패:',
              error
            )
          }

          // 현재 정책:
          // 직접 취소 = 100% 환불

          setRefundMileage(
            Number(
              cancelledOrder
                ?.totalPrice ??
                selectedOrder
                  ?.totalPrice ??
                0
            )
          )

          setPage(
            'orderCancelComplete'
          )
        }}
      />
    )
  }

  // ========================================
  // 주문 취소 완료
  // ========================================

  else if (
    page ===
    'orderCancelComplete'
  ) {
    content = (
      <OrderCancelComplete
        refundMileage={
          refundMileage
        }

        onHome={() => {
          setSelectedOrder(
            null
          )

          setRefundMileage(0)

          setPage('home')
        }}
      />
    )
  }

  // ========================================
  // 현장 도착 인증
  // ========================================

  else if (
    page ===
    'arrivalVerify'
  ) {
    content = (
      <ArrivalVerify
        orderId={
          selectedOrder
            ?.orderId
        }

        onBack={() => {
          setPage(
            'orderComplete'
          )
        }}

        // ================================
        // 서버가 반환한 COOKING 주문을
        // 그대로 저장
        // ================================

        onSuccess={(
          updatedOrder
        ) => {
          setSelectedOrder(
            updatedOrder
          )

          setPage('waiting')
        }}
      />
    )
  }

  // ========================================
  // 조리 중
  // ========================================

  else if (
    page === 'waiting'
  ) {
    content = (
      <Waiting
        order={
          selectedOrder
        }

        // ================================
        // Waiting이 서버를 polling하고
        // RECEIVED가 되면 최신 주문을 전달
        // ================================

        onReady={(
          updatedOrder
        ) => {
          setSelectedOrder(
            updatedOrder
          )

          setPage(
            'foodReady'
          )
        }}
      />
    )
  }

  // ========================================
  // 음식 준비 완료
  // ========================================

  else if (
    page === 'foodReady'
  ) {
    content = (
      <FoodReady
        order={
          selectedOrder
        }

        onHome={() => {
          setSelectedOrder(
            null
          )

          setPage('home')
        }}
      />
    )
  }

  // ========================================
  // 알림
  // ========================================

  else if (
    page ===
    'notifications'
  ) {
    content = (
      <Notifications />
    )
  }

  // ========================================
  // 처음 실행
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
  // 관리자 페이지 여부
  // ========================================

  const isAdminPage =
    page ===
      'adminDashboard' ||
    page ===
      'adminWaiting' ||
    page ===
      'adminStats' ||
    page ===
      'adminOccupancy'

  // ========================================
  // 학생 하단 네비게이션
  // ========================================

  const showBottomNav =
    !isAdminPage &&
    page !==
      'onboarding' &&
    page !== 'login' &&
    page !== 'signup' &&
    page !==
      'forgotPassword' &&
    page !==
      'orderConfirm' &&
    page !==
      'mileageCharge' &&
    page !==
      'mileagePayment' &&
    page !==
      'mileageChargeComplete'

  // ========================================
  // 관리자 하단 네비게이션
  // ========================================

  const showAdminBottomNav =
    isAdminPage &&
    page !==
      'adminOccupancy'

  // ========================================
  // 학생 하단 네비게이션 활성 메뉴
  // ========================================

  let activeNav = 'orders'

  if (
    page === 'home' ||
    page === 'store'
  ) {
    activeNav = 'home'
  }

  if (
    page ===
    'notifications'
  ) {
    activeNav =
      'notifications'
  }

  if (
    page ===
      'orderConfirm' ||
    page ===
      'mileageCharge' ||
    page ===
      'mileagePayment' ||
    page ===
      'mileageChargeComplete' ||
    page ===
      'orderComplete' ||
    page ===
      'orderCancelComplete' ||
    page ===
      'arrivalVerify' ||
    page === 'waiting' ||
    page === 'foodReady'
  ) {
    activeNav = 'orders'
  }

  // ========================================
  // 관리자 활성 메뉴
  // ========================================

  let activeAdminNav =
    'dashboard'

  if (
    page ===
    'adminWaiting'
  ) {
    activeAdminNav =
      'waiting'
  }

  if (
    page ===
    'adminStats'
  ) {
    activeAdminNav =
      'stats'
  }

  // ========================================
  // 최종 출력
  // ========================================

  return (
    <>
      <div
        className={
          showBottomNav &&
          !isAdminPage
            ? 'student-page-with-nav'
            : ''
        }
      >
        {content}
      </div>

      {showBottomNav &&
        !isAdminPage && (
          <BottomNav
            active={
              activeNav
            }
            onHome={
              goHome
            }
            onOrders={
              goOrders
            }
            onNotifications={
              goNotifications
            }
          />
        )}

      {showAdminBottomNav && (
        <AdminBottomNav
          active={
            activeAdminNav
          }
          onDashboard={
            goAdminDashboard
          }
          onWaiting={
            goAdminWaiting
          }
          onStats={
            goAdminStats
          }
        />
      )}
    </>
  )
}

export default App 

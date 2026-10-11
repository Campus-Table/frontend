import { useEffect, useState } from 'react'

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
import MyOrders from './pages/MyOrders'
import MyPage from './pages/MyPage'
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

import {
  getCurrentUser,
  logout,
} from './api/authApi'


function App() {
  // ========================================
  // 현재 페이지
  // ========================================

  const [
    page,
    setPage,
  ] = useState(() => {
    const pathname = window.location.pathname

    if (
      pathname === '/mileage/success' ||
      pathname === '/mileage/fail'
    ) {
      return 'mileagePayment'
    }

    return 'onboarding'
  })
  // ========================================
  // 로그인 사용자
  // ========================================

  const [
    currentUser,
    setCurrentUser,
  ] = useState(null)


  // ========================================
  // 로그인 세션 복원
  // ========================================

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const user = await getCurrentUser()

        setCurrentUser(user)

        // Toss 결제 후 돌아온 경우에는
        // MileagePayment가 결제 승인 처리를 해야 하므로
        // 현재 페이지를 변경하지 않음
        const pathname = window.location.pathname

        if (
          pathname === '/mileage/success' ||
          pathname === '/mileage/fail'
        ) {
          return
        }

        // 로그인 세션이 살아 있다면
        // 사용자 권한에 맞는 첫 화면으로 이동
        if (user?.role === 'ADMIN') {
          setPage('adminDashboard')
        } else {
          setPage('home')
        }
      } catch (error) {
        // 로그인하지 않은 상태라면
        // 기존 온보딩 화면을 그대로 유지
        if (
          error?.status === 401 ||
          error?.code === 'UNAUTHORIZED'
        ) {
          setCurrentUser(null)
          return
        }

        console.error(
          '로그인 세션 복원 실패:',
          error
        )
      }
    }

    restoreSession()
  }, [])

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
  ] = useState(() => {
    try {
      const savedOrder =
        sessionStorage.getItem(
          'campus-table-selected-order'
        )

      return savedOrder
        ? JSON.parse(savedOrder)
        : null
    } catch (error) {
      console.error(
        '주문 정보 복원 실패:',
        error
      )

      return null
    }
  })

  useEffect(() => {
    if (selectedOrder) {
      sessionStorage.setItem(
        'campus-table-selected-order',
        JSON.stringify(
          selectedOrder
        )
      )
    } else {
      sessionStorage.removeItem(
        'campus-table-selected-order'
      )
    }
  }, [selectedOrder])

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
        setPage('myOrders')
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

      // 그 외 상태는 전체 주문내역으로
      setPage('myOrders')
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
  // 마이페이지
  // ========================================

  const goMyPage = () => {
    setPage('mypage')
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
  // 관리자 로그아웃
  // ========================================

  const handleAdminLogout =
    async () => {
      try {
        // 서버 로그아웃 API 호출
        await logout()

        // 현재 로그인 사용자 정보 초기화
        setCurrentUser(null)

        // 로그인 화면으로 이동
        setPage('login')
      } catch (error) {
        console.error(
          '관리자 로그아웃 실패:',
          error
        )

        alert(
          error.message ||
            '로그아웃에 실패했습니다.'
        )

        // AdminAccountMenu에서
        // 로그아웃 실패를 알 수 있도록 다시 전달
        throw error
      }
    }

  // ========================================
  // 관리자 대시보드
  // ========================================

  if (
    page ===
    'adminDashboard'
  ) {
    content = (
      <AdminDashboard
        // 현재 대기 현황 화면으로 이동
        onWaiting={
          goAdminWaiting
        }

        // 인원 현황 관리 화면으로 이동
        onOccupancy={
          goAdminOccupancy
        }

        // 관리자 로그아웃
        onLogout={
          handleAdminLogout
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
      <AdminWaiting
        // 관리자 로그아웃
        onLogout={
          handleAdminLogout
        }
      />
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
      <AdminStats
        // 관리자 로그아웃
        onLogout={
          handleAdminLogout
        }
      />
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
        // 관리자 대시보드로 이동
        onBack={() => {
          setPage(
            'adminDashboard'
          )
        }}

        // 관리자 로그아웃
        onLogout={
          handleAdminLogout
        }
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
          setSelectedOrder(
            createdOrder
          )

          setPage(
            'orderComplete'
          )
        }}

        onCharge={() => {
          setPage(
            'mileageCharge'
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
            // Toss 결제 후 돌아오면
            // 충전 금액을 다시 저장
            if (
              paymentResult?.amount !=
              null
            ) {
              setChargeAmount(
                Number(
                  paymentResult.amount
                )
              )
            }

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
  // 내 주문
  // ========================================

  else if (
    page === 'myOrders'
  ) {
    content = (
      <MyOrders
        onBack={() => {
          setPage('home')
        }}

        onSelectOrder={(order) => {
          setSelectedOrder(order)

          if (
            order.status === 'PAID'
          ) {
            setPage('orderComplete')
            return
          }

          if (
            order.status === 'COOKING'
          ) {
            setPage('waiting')
            return
          }

          if (
            order.status === 'RECEIVED'
          ) {
            setPage('foodReady')
          }
        }}
      />
    )
  }

  // ========================================
  // 마이페이지
  // ========================================

  else if (
    page === 'mypage'
  ) {
    content = (
      <MyPage
        onLogout={() => {
          setCurrentUser(null)
          setSelectedOrder(null)

          sessionStorage.removeItem(
            'campus-table-selected-order'
          )

          setPage('login')
        }}

        onUnauthorized={() => {
          setCurrentUser(null)
          setSelectedOrder(null)

          sessionStorage.removeItem(
            'campus-table-selected-order'
          )

          alert(
            '로그인이 만료되었습니다. 다시 로그인해주세요.'
          )

          setPage('login')
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
            onMyPage={
              goMyPage
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

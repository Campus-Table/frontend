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
import OrderCancelComplete from './pages/OrderCancelComplete'
import ArrivalVerify from './pages/ArrivalVerify'
import Waiting from './pages/Waiting'
import FoodReady from './pages/FoodReady'
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
const ADMIN_PREVIEW = false

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

  // ========================================
  // 사용자가 선택한 충전 금액
  // ========================================
  const [chargeAmount, setChargeAmount] = useState(0)

  // ========================================
  // 주문 취소 시 환불된 마일리지
  // ========================================
  const [refundMileage, setRefundMileage] = useState(0)

  // ========================================
  // 주문 진행 상태
  //
  // none    = 주문 없음
  // paid    = 결제 완료 / 현장 인증 전
  // waiting = 현장 인증 완료 / 조리 중
  // ready   = 음식 준비 완료 / 수령 대기
  // ========================================
  const [orderStatus, setOrderStatus] = useState('none')

  // ========================================
  // 학생 하단 네비게이션
  // ========================================
  const goHome = () => {
    setPage('home')
  }

  const goOrders = () => {

    // ========================================
    // 음식 준비 완료
    // ========================================
    if (
      selectedOrder &&
      orderStatus === 'ready'
    ) {
      setPage('foodReady')
      return
    }

    // ========================================
    // 현장 인증 완료 / 조리 중
    // ========================================
    if (
      selectedOrder &&
      orderStatus === 'waiting'
    ) {
      setPage('waiting')
      return
    }

    // ========================================
    // 결제 완료 / 현장 인증 전
    // ========================================
    if (
      selectedOrder &&
      orderStatus === 'paid'
    ) {
      setPage('orderComplete')
      return
    }

    // ========================================
    // 주문이 없는 경우
    // ========================================
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
        onBack={() => {
          setPage('adminDashboard')
        }}
      />
    )
  }

  // ========================================
  // 로그인
  // ========================================
  else if (page === 'login') {
    content = (
      <Login
        onBack={() => {
          setPage('onboarding')
        }}

        onLogin={() => {
          setPage('home')
        }}

        onSignup={() => {
          setPage('signup')
        }}

        onForgotPassword={() => {
          setPage('forgotPassword')
        }}
      />
    )
  }

  // ========================================
  // 회원가입
  // ========================================
  else if (page === 'signup') {
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
  // 비밀번호 찾기 / 재설정
  // ========================================
  else if (page === 'forgotPassword') {
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

          // 선택한 메뉴 저장
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

        // 뒤로가기
        onBack={() => {
          setPage('store')
        }}

        // 마일리지 충전
        onCharge={() => {
          setPage('mileageCharge')
        }}

        // ========================================
        // 주문 결제
        // ========================================
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

          // ========================================
          // 마일리지 차감
          // ========================================
          setMileage(
            (previousMileage) =>
              previousMileage - price
          )

          // ========================================
          // 실제 결제한 금액을 주문 정보에 저장
          //
          // 주문 취소 시 이 값을 기준으로
          // 50% 환불
          // ========================================
          setSelectedOrder(
            (previousOrder) => ({
              ...previousOrder,
              usedMileage: price,
            })
          )

          // 주문 상태
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

        // 뒤로가기
        onBack={() => {
          setPage('orderPayment')
        }}

        // 충전 금액 선택
        onCharge={(amount) => {

          setChargeAmount(amount)

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

        // ========================================
        // 결제 성공
        //
        // 현재는 실제 토스 API 연동 전
        // ========================================
        onPaymentComplete={() => {

          // 마일리지 충전
          setMileage(
            (previousMileage) =>
              previousMileage + chargeAmount
          )

          // 충전 완료
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

        // 확인
        onConfirm={() => {
          setPage('orderPayment')
        }}
      />
    )
  }

  // ========================================
  // 주문 완료
  //
  // 결제는 끝났지만 아직 현장 인증 전
  // ========================================
  else if (page === 'orderComplete') {
    content = (
      <OrderComplete
        order={selectedOrder}

        // ========================================
        // 현장 도착 인증
        // ========================================
        onVerify={() => {
          setPage('arrivalVerify')
        }}

        // ========================================
        // 주문 취소
        // ========================================
        onCancel={() => {

          if (!selectedOrder) {
            return
          }

          // 실제 결제 마일리지
          const paidMileage =
            Number(
              selectedOrder.usedMileage ??
              selectedOrder.price ??
              0
            )

          // ========================================
          // 결제 금액의 50% 환불
          // ========================================
          const refund =
            Math.floor(paidMileage * 0.5)

          // 실제 마일리지에 환불
          setMileage(
            (previousMileage) =>
              previousMileage + refund
          )

          // 취소 완료 화면 표시용
          setRefundMileage(refund)

          // 주문 상태 초기화
          setOrderStatus('none')

          // ========================================
          // 여기서는 selectedOrder를 삭제하지 않음
          //
          // 취소 완료 화면에서 홈으로 이동할 때
          // 삭제
          // ========================================
          setPage('orderCancelComplete')
        }}
      />
    )
  }

  // ========================================
  // 주문 취소 완료
  // ========================================
  else if (page === 'orderCancelComplete') {
    content = (
      <OrderCancelComplete
        refundMileage={refundMileage}

        onHome={() => {

          // 취소 주문 제거
          setSelectedOrder(null)

          // 환불 표시값 초기화
          setRefundMileage(0)

          // 주문 상태 초기화
          setOrderStatus('none')

          // 홈
          setPage('home')
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
        // 뒤로가기
        onBack={() => {
          setPage('orderComplete')
        }}

        // ========================================
        // 도착 인증 성공
        // ========================================
        onSuccess={() => {

          // 조리 중 상태
          setOrderStatus('waiting')

          // 대기 화면
          setPage('waiting')
        }}
      />
    )
  }

  // ========================================
  // 대기번호 / 음식 조리 중
  // ========================================
  else if (page === 'waiting') {
    content = (
      <Waiting
        order={selectedOrder}

        // ========================================
        // Waiting.jsx 타이머가 0:00이 되면
        // 자동으로 실행됨
        // ========================================
        onReady={() => {

          // 음식 준비 완료 상태
          setOrderStatus('ready')

          // 음식 준비 완료 화면
          setPage('foodReady')
        }}
      />
    )
  }

  // ========================================
  // 음식 준비 완료
  //
  // Waiting 타이머가 0:00이 되면
  // 자동으로 이 화면으로 이동
  // ========================================
  else if (page === 'foodReady') {
    content = (
      <FoodReady
        order={selectedOrder}

        waitingNumber="A-013"

        // ========================================
        // 홈으로 돌아가기
        // ========================================
        onHome={() => {

          // 주문 종료
          setSelectedOrder(null)

          // 주문 상태 초기화
          setOrderStatus('none')

          // 홈으로 이동
          setPage('home')
        }}
      />
    )
  }

  // ========================================
  // 알림
  //
  // orderStatus를 Notifications로 전달
  //
  // ready일 경우 다음 단계에서
  // "음식을 수령하러 와주세요"
  // 알림을 표시하도록 연결
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
  // 학생 하단 네비게이션 표시 여부
  //
  // 아래 화면에서는 숨김
  //
  // 온보딩
  // 로그인
  // 회원가입
  // 비밀번호 찾기
  // 주문 결제
  // 마일리지 충전
  // 토스 결제
  // 충전 완료
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
  // ========================================
  const showAdminBottomNav =
    isAdminPage &&
    page !== 'adminOccupancy'

  // ========================================
  // 학생 하단 네비게이션 활성 메뉴
  // ========================================
  let activeNav = 'orders'

  // ========================================
  // 홈 / 가게 상세
  // ========================================
  if (
    page === 'home' ||
    page === 'store'
  ) {
    activeNav = 'home'
  }

  // ========================================
  // 알림
  // ========================================
  if (page === 'notifications') {
    activeNav = 'notifications'
  }

  // ========================================
  // 주문 관련 화면
  // ========================================
  if (
    page === 'orderPayment' ||
    page === 'mileageCharge' ||
    page === 'mileagePayment' ||
    page === 'mileageChargeComplete' ||
    page === 'orderComplete' ||
    page === 'orderCancelComplete' ||
    page === 'arrivalVerify' ||
    page === 'waiting' ||
    page === 'foodReady'
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

      {/* =====================================
          학생 하단 네비게이션
      ===================================== */}
      {showBottomNav && !isAdminPage && (
        <BottomNav
          active={activeNav}
          onHome={goHome}
          onOrders={goOrders}
          onNotifications={goNotifications}
        />
      )}

      {/* =====================================
          관리자 하단 네비게이션
      ===================================== */}
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


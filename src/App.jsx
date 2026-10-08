import { useState } from 'react'
import './App.css'

import Onboarding from './pages/Onboarding'
import Login from './pages/Login'
import StudentHome from './pages/StudentHome'
import StoreDetail from './pages/StoreDetail'
import OrderConfirm from './pages/OrderConfirm'
import OrderComplete from './pages/OrderComplete'

function App() {
  const [page, setPage] = useState('onboarding')

  const [selectedStore, setSelectedStore] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)

  if (page === 'login') {
    return (
      <Login
        onBack={() => setPage('onboarding')}
        onLogin={() => setPage('home')}
      />
    )
  }

  if (page === 'home') {
    return (
      <StudentHome
        onStore={(storeId) => {
          setSelectedStore(storeId)
          setPage('store')
        }}
        onOrders={() => {
          console.log('내 주문')
        }}
        onNotifications={() => {
          console.log('알림')
        }}
      />
    )
  }

  if (page === 'store') {
    return (
      <StoreDetail
        storeId={selectedStore}
        onBack={() => setPage('home')}
        onOrder={(order) => {
          setSelectedOrder(order)
          setPage('orderConfirm')
        }}
      />
    )
  }

  if (page === 'orderConfirm') {
    return (
      <OrderConfirm
        order={selectedOrder}
        onBack={() => setPage('store')}
        onPay={(order) => {
          setSelectedOrder(order)
          setPage('orderComplete')
        }}
      />
    )
  }

  if (page === 'orderComplete') {
    return (
      <OrderComplete
        order={selectedOrder}
        onVerify={() => {
          console.log('현장 인증하기')
        }}
      />
    )
  }

  return (
    <Onboarding
      onLogin={() => setPage('login')}
    />
  )
}

export default App
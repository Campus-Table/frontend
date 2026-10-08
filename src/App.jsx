import { useState } from 'react'
import './App.css'

import Onboarding from './pages/Onboarding'
import Login from './pages/Login'
import StudentHome from './pages/StudentHome'
import StoreDetail from './pages/StoreDetail'

function App() {
  const [page, setPage] = useState('onboarding')
  const [selectedStore, setSelectedStore] = useState(null)

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
        onOrder={(menu) => {
          console.log('선택한 메뉴:', menu)
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
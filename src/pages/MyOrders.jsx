import { useEffect, useState } from 'react'

import {
  getMyOrders,
} from '../api/orderApi'

function MyOrders({
  onBack,
  onSelectOrder,
}) {
  const [orders, setOrders] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true)
        setError('')

        const result =
          await getMyOrders()

        // API가 배열을 직접 반환하는 경우와
        // { orders: [...] } 형태를 모두 처리
        const orderList =
          Array.isArray(result)
            ? result
            : Array.isArray(
                  result?.orders
                )
              ? result.orders
              : []

        setOrders(orderList)
      } catch (error) {
        console.error(
          '주문 내역 조회 실패:',
          error
        )

        setError(
          error.message ||
            '주문 내역을 불러오지 못했습니다.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  const getStatusText = (
    status
  ) => {
    switch (status) {
      case 'PAID':
        return '결제 완료'

      case 'COOKING':
        return '조리 중'

      case 'RECEIVED':
        return '음식 준비 완료'

      case 'CANCELLED':
        return '주문 취소'

      default:
        return status || '주문'
    }
  }

  return (
    <main className="my-orders-page">
      <header className="my-orders-header">
        <button
          type="button"
          className="my-orders-back"
          onClick={onBack}
          aria-label="뒤로가기"
        >
          ‹
        </button>

        <h1>내 주문</h1>
      </header>

      <section className="my-orders-content">
        <div className="my-orders-title">
          <p>ORDER HISTORY</p>

          <h2>주문 내역</h2>

          <span>
            주문한 메뉴와 진행 상태를
            확인하세요.
          </span>
        </div>

        {loading && (
          <div className="my-orders-message">
            주문 내역을 불러오는
            중입니다...
          </div>
        )}

        {!loading && error && (
          <div className="my-orders-message my-orders-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          orders.length === 0 && (
            <div className="my-orders-empty">
              <div className="my-orders-empty-icon">
                ♙
              </div>

              <h3>
                아직 주문 내역이 없어요.
              </h3>

              <p>
                메뉴를 주문하면 이곳에서
                확인할 수 있어요.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          orders.length > 0 && (
            <div className="my-orders-list">
              {orders.map(
                (order, index) => {
                  const orderId =
                    order.orderId ??
                    order.id ??
                    index

                  const storeName =
                    order.storeName ??
                    order.store?.name ??
                    '주문 매장'

                  const menuName =
                    order.menuName ??
                    order.items?.[0]
                      ?.menuName ??
                    order.items?.[0]
                      ?.name ??
                    '주문 메뉴'

                  const totalAmount =
                    order.totalAmount ??
                    order.amount ??
                    order.totalPrice

                  return (
                    <button
                      type="button"
                      className="my-order-card"
                      key={orderId}
                      onClick={() =>
                        onSelectOrder?.(
                          order
                        )
                      }
                    >
                      <div className="my-order-card-top">
                        <strong>
                          {storeName}
                        </strong>

                        <span>
                          {getStatusText(
                            order.status
                          )}
                        </span>
                      </div>

                      <div className="my-order-card-body">
                        <div className="my-order-icon">
                          🍽️
                        </div>

                        <div className="my-order-info">
                          <h3>
                            {menuName}
                          </h3>

                          {order.queueNumber !=
                            null && (
                            <p>
                              대기번호{' '}
                              {
                                order.queueNumber
                              }
                              번
                            </p>
                          )}

                          {totalAmount !=
                            null && (
                            <strong>
                              {Number(
                                totalAmount
                              ).toLocaleString()}
                              P
                            </strong>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                }
              )}
            </div>
          )}
      </section>
    </main>
  )
}

export default MyOrders 

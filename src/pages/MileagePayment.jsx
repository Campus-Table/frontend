import {
  useEffect,
  useState,
} from 'react'

import {
  prepareMileageCharge,
} from '../api/mileageApi'

function MileagePayment({
  currentMileage = 0,
  chargeAmount,
  onPaymentComplete,
  onCancel,
}) {
  const [
    paymentInfo,
    setPaymentInfo,
  ] = useState(null)

  const [
    isLoading,
    setIsLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')

  // ======================================================
  // 토스 결제 준비
  // ======================================================

  useEffect(() => {
    let cancelled = false

    const preparePayment = async () => {
      try {
        setIsLoading(true)
        setError('')

        const data =
          await prepareMileageCharge(
            chargeAmount
          )

        if (cancelled) {
          return
        }

        setPaymentInfo(data)
      } catch (error) {
        if (cancelled) {
          return
        }

        console.error(
          '마일리지 충전 준비 실패:',
          error
        )

        setError(
          error.message ||
            '결제를 준비하지 못했습니다.'
        )
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    if (
      chargeAmount >= 1000 &&
      chargeAmount <= 100000
    ) {
      preparePayment()
    } else {
      setError(
        '올바른 충전 금액이 아닙니다.'
      )

      setIsLoading(false)
    }

    return () => {
      cancelled = true
    }
  }, [chargeAmount])

  return (
    <main className="mileage-payment-page">

      {/* 현재 잔액 */}

      <section className="charge-balance-card">

        <p>현재 잔액</p>

        <strong>
          {currentMileage.toLocaleString()}P
        </strong>

      </section>

      {/* 토스 결제 */}

      <section className="toss-payment-card">

        <div className="payment-loading-circle" />

        {isLoading ? (
          <>
            <h2>
              결제를 준비하고 있어요
            </h2>

            <p>
              잠시만 기다려주세요.
            </p>
          </>
        ) : error ? (
          <>
            <h2>
              결제를 준비하지 못했어요
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="payment-cancel-button"
              onClick={onCancel}
            >
              돌아가기
            </button>
          </>
        ) : (
          <>
            <h2>
              토스 결제를 진행해주세요
            </h2>

            <p>
              {chargeAmount.toLocaleString()}P
              를 충전합니다.
            </p>

            {/*
              TODO:
              paymentInfo.clientKey
              paymentInfo.customerKey
              paymentInfo.orderId
              paymentInfo.amount

              위 값을 사용해서
              토스 테스트 결제창을 호출해야 함.
            */}

            <button
              type="button"
              className="payment-demo-button"
              onClick={() => {
                if (onPaymentComplete) {
                  onPaymentComplete(
                    paymentInfo
                  )
                }
              }}
            >
              결제 완료 시연
            </button>

            <button
              type="button"
              className="payment-cancel-button"
              onClick={onCancel}
            >
              결제 취소
            </button>
          </>
        )}

      </section>

    </main>
  )
}

export default MileagePayment 

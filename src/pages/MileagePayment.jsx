import { useEffect, useState } from 'react'
import { loadTossPayments } from '@tosspayments/tosspayments-sdk'

import {
  prepareMileageCharge,
  confirmMileageCharge,
} from '../api/mileageApi'

function MileagePayment({
  currentMileage = 0,
  chargeAmount,
  onPaymentComplete,
  onCancel,
}) {
  const [paymentInfo, setPaymentInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPaying, setIsPaying] = useState(false)
  const [error, setError] = useState('')

  // ======================================================
  // 토스 결제 성공/실패 URL 처리
  // ======================================================

  useEffect(() => {
    const pathname = window.location.pathname
    const params = new URLSearchParams(window.location.search)

    // ------------------------------------------------------
    // 결제 실패
    // ------------------------------------------------------

    if (pathname === '/mileage/fail') {
      const message =
        params.get('message') ||
        '결제가 취소되었거나 실패했습니다.'

      setError(message)
      setIsLoading(false)

      // 주소창의 Toss 파라미터 제거
      window.history.replaceState(
        {},
        '',
        window.location.origin
      )

      return
    }

    // ------------------------------------------------------
    // 결제 성공
    // ------------------------------------------------------

    if (pathname !== '/mileage/success') {
      return
    }

    let cancelled = false

    const confirmPayment = async () => {
      try {
        setIsLoading(true)
        setIsPaying(true)
        setError('')

        const paymentKey =
          params.get('paymentKey')

        const orderId =
          params.get('orderId')

        const amount =
          Number(params.get('amount'))

        if (
          !paymentKey ||
          !orderId ||
          !Number.isFinite(amount)
        ) {
          throw new Error(
            '결제 완료 정보가 올바르지 않습니다.'
          )
        }

        // 결제 요청 전에 저장해둔 정보 확인
        const savedPayment =
          sessionStorage.getItem(
            `mileage-payment:${orderId}`
          )

        if (!savedPayment) {
          throw new Error(
            '결제 준비 정보를 찾을 수 없습니다.'
          )
        }

        const parsedPayment =
          JSON.parse(savedPayment)

        if (
          parsedPayment.orderId !== orderId ||
          Number(parsedPayment.amount) !== amount
        ) {
          throw new Error(
            '결제 금액 정보가 일치하지 않습니다.'
          )
        }

        // 백엔드에서 Toss 최종 승인
        const result =
          await confirmMileageCharge(
            paymentKey,
            orderId,
            amount
          )

        if (cancelled) {
          return
        }

        // 정상 승인된 결제 정보 제거
        sessionStorage.removeItem(
          `mileage-payment:${orderId}`
        )

        // URL 정리
        window.history.replaceState(
          {},
          '',
          window.location.origin
        )

        // App.jsx에 서버의 실제 잔액 전달
        if (onPaymentComplete) {
          onPaymentComplete({
            balance: result.balance,
            amount,
            orderId,
          })
        }
      } catch (err) {
        if (cancelled) {
          return
        }

        console.error(
          '마일리지 결제 승인 실패:',
          err
        )

        setError(
          err.message ||
            '결제 승인에 실패했습니다.'
        )

        setIsLoading(false)
        setIsPaying(false)
      }
    }

    confirmPayment()

    return () => {
      cancelled = true
    }
  }, [onPaymentComplete])

  // ======================================================
  // 토스 결제 준비
  // ======================================================

  useEffect(() => {
    const pathname =
      window.location.pathname

    // Toss에서 돌아온 상태라면
    // 새로운 결제 준비 요청을 보내지 않음
    if (
      pathname === '/mileage/success' ||
      pathname === '/mileage/fail'
    ) {
      return
    }

    let cancelled = false

    const preparePayment = async () => {
      try {
        setIsLoading(true)
        setError('')

        const data =
          await prepareMileageCharge(
            chargeAmount
          )

        if (!cancelled) {
          setPaymentInfo(data)
        }
      } catch (err) {
        if (!cancelled) {
          console.error(
            '결제 준비 실패:',
            err
          )

          setError(
            err.message ||
              '결제를 준비하지 못했습니다.'
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    if (
      Number.isInteger(chargeAmount) &&
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

  // ======================================================
  // Toss 결제창 실행
  // ======================================================

  const handlePayment = async () => {
    if (
      !paymentInfo ||
      isPaying
    ) {
      return
    }

    try {
      setIsPaying(true)
      setError('')

      const {
        clientKey,
        customerKey,
        orderId,
        amount,
      } = paymentInfo

      if (
        !clientKey ||
        !customerKey ||
        !orderId ||
        Number(amount) !==
          Number(chargeAmount)
      ) {
        throw new Error(
          '결제 준비 정보가 올바르지 않습니다.'
        )
      }

      // Toss에서 돌아온 뒤 검증하기 위해 저장
      sessionStorage.setItem(
        `mileage-payment:${orderId}`,
        JSON.stringify({
          orderId,
          amount: Number(amount),
        })
      )

      const tossPayments =
        await loadTossPayments(
          clientKey
        )

      const payment =
        tossPayments.payment({
          customerKey,
        })

      await payment.requestPayment({
        method: 'CARD',

        amount: {
          currency: 'KRW',
          value: Number(amount),
        },

        orderId,

        orderName:
          'Campus Table 마일리지 충전',

        successUrl:
          `${window.location.origin}/mileage/success`,

        failUrl:
          `${window.location.origin}/mileage/fail`,
      })
    } catch (err) {
      console.error(
        '토스 결제 요청 실패:',
        err
      )

      setError(
        err.message ||
          '결제를 진행하지 못했습니다.'
      )

      setIsPaying(false)
    }
  }

  // ======================================================
  // 화면
  // ======================================================

  return (
    <main className="mileage-payment-page">

      <section className="charge-balance-card">
        <p>현재 잔액</p>

        <strong>
          {Number(
            currentMileage
          ).toLocaleString()}P
        </strong>
      </section>

      <section className="toss-payment-card">

        <div className="payment-loading-circle" />

        {isLoading ? (
          <>
            <h2>
              {isPaying
                ? '결제를 승인하고 있어요'
                : '결제를 준비하고 있어요'}
            </h2>

            <p>
              잠시만 기다려주세요.
            </p>
          </>
        ) : error &&
          !paymentInfo ? (
          <>
            <h2>
              결제를 진행하지 못했어요
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
              {Number(
                chargeAmount
              ).toLocaleString()}P를
              충전합니다.
            </p>

            {error && (
              <p role="alert">
                {error}
              </p>
            )}

            <button
              type="button"
              className="payment-demo-button"
              onClick={handlePayment}
              disabled={isPaying}
            >
              {isPaying
                ? '결제창을 여는 중...'
                : '토스로 결제하기'}
            </button>

            <button
              type="button"
              className="payment-cancel-button"
              onClick={onCancel}
              disabled={isPaying}
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


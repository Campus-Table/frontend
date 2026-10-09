import { apiFetch } from './client'

export function getMileage() {
  return apiFetch('/api/mileage')
}

export function getMileageTransactions() {
  return apiFetch(
    '/api/mileage/transactions'
  )
}

export function prepareMileageCharge(amount) {
  return apiFetch(
    '/api/mileage/charge/prepare',
    {
      method: 'POST',
      body: JSON.stringify({
        amount,
      }),
    }
  )
}

export function confirmMileageCharge(
  paymentKey,
  orderId,
  amount
) {
  return apiFetch(
    '/api/mileage/charge/confirm',
    {
      method: 'POST',
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    }
  )
} 

// 토스 결제 후 돌아온 주소를 해석한다.
// 정적 호스팅(Object Storage/CDN)에는 /mileage/success 같은 경로의 파일이 없어 404가 나므로,
// 결제 후 루트(/)로 돌아오게 하고 쿼리로 성공/실패를 구분한다.
//   성공: /?paymentKey=...&orderId=...&amount=...
//   실패: /?code=...&message=...&orderId=...
// 예전 경로 방식(/mileage/success, /mileage/fail)도 그대로 인식한다.
export function getTossReturn() {
  const { pathname, search } = window.location
  const params = new URLSearchParams(search)

  if (pathname === '/mileage/success' || params.has('paymentKey')) {
    return 'success'
  }

  if (
    pathname === '/mileage/fail' ||
    (params.has('code') && params.has('message'))
  ) {
    return 'fail'
  }

  return null
}

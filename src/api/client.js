const API_BASE_URL =
  'https://api.campus-table.kro.kr'

export class ApiError extends Error {
  constructor(
    status,
    code,
    message,
    retryAfter = null
  ) {
    super(message)

    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.retryAfter = retryAfter
  }
}

export async function apiFetch(
  path,
  options = {}
) {
  const isFormData =
    options.body instanceof FormData

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,

      // SESSION 쿠키 전송
      credentials: 'include',

      headers: {
        ...(options.body && !isFormData
          ? {
              'Content-Type':
                'application/json',
            }
          : {}),

        ...options.headers,
      },
    }
  )

  // =========================
  // 204 No Content
  // =========================

  if (response.status === 204) {
    return null
  }

  const contentType =
    response.headers.get(
      'content-type'
    ) || ''

  const isJson =
    contentType.includes(
      'application/json'
    )

  // =========================
  // 오류 응답
  // =========================

  if (!response.ok) {
    let errorData = null

    if (isJson) {
      errorData = await response
        .json()
        .catch(() => null)
    }

    const retryAfter =
      response.headers.get(
        'Retry-After'
      )

    throw new ApiError(
      response.status,
      errorData?.code ||
        'UNKNOWN_ERROR',
      errorData?.message ||
        '요청을 처리하지 못했습니다.',
      retryAfter
    )
  }

  // =========================
  // 정상 응답인데 JSON이 아닌 경우
  // =========================

  if (!isJson) {
    throw new ApiError(
      response.status,
      'INVALID_RESPONSE',
      '서버 API 응답을 받지 못했습니다. 백엔드 서버와 프록시 설정을 확인해주세요.'
    )
  }

  return response.json()
} 

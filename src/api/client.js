export class ApiError extends Error {
    constructor(status, code, message, retryAfter = null) {
      super(message)
  
      this.name = 'ApiError'
      this.status = status
      this.code = code
      this.retryAfter = retryAfter
    }
  }
  
  export async function apiFetch(path, options = {}) {
    const isFormData = options.body instanceof FormData
  
    const response = await fetch(path, {
      ...options,
  
      credentials: 'include',
  
      headers: {
        ...(options.body && !isFormData
          ? {
              'Content-Type': 'application/json',
            }
          : {}),
  
        ...options.headers,
      },
    })
  
    // 204 No Content
    if (response.status === 204) {
      return null
    }
  
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => null)
  
      const retryAfter =
        response.headers.get('Retry-After')
  
      throw new ApiError(
        response.status,
        errorData?.code || 'UNKNOWN_ERROR',
        errorData?.message ||
          '요청을 처리하지 못했습니다.',
        retryAfter
      )
    }
  
    return response.json()
  }
import axios from 'axios'

interface ProblemDetail {
  title?: string
  detail?: string
  status?: number
  errors?: Record<string, string>
}

export class ApiError extends Error {
  readonly status?: number
  readonly title?: string
  readonly fieldErrors?: Record<string, string>

  constructor(
    message: string,
    options: {
      status?: number
      title?: string
      fieldErrors?: Record<string, string>
    } = {},
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = options.status
    this.title = options.title
    this.fieldErrors = options.fieldErrors
  }
}

const apiBaseUrl = import.meta.env.VITE_API_URL

if (!apiBaseUrl) {
  throw new Error('Configura VITE_API_URL para conectar con el backend.')
}

// Patrón de diseño: Singleton
export const httpClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeApiError(error)),
)

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError<ProblemDetail>(error)) {
    const body = error.response?.data
    const networkMessage = error.response
      ? 'La solicitud no pudo completarse.'
      : 'No fue posible conectar con el servidor. Verifica que la API esté disponible.'

    return new ApiError(body?.detail || body?.title || networkMessage, {
      status: error.response?.status,
      title: body?.title,
      fieldErrors: body?.errors,
    })
  }

  if (error instanceof Error) {
    return new ApiError(error.message)
  }

  return new ApiError('Ocurrió un error inesperado.')
}

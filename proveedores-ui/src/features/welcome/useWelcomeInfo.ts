import { useEffect, useState } from 'react'
import { normalizeApiError, type ApiError } from '../../shared/api/httpClient'
import {
  getApplicationVersion,
  getWelcomeMessage,
} from './welcomeApi'

interface WelcomeInfo {
  message: string
  version: string
}

export function useWelcomeInfo() {
  const [info, setInfo] = useState<WelcomeInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    const controller = new AbortController()

    Promise.all([
      getWelcomeMessage(controller.signal),
      getApplicationVersion(controller.signal),
    ])
      .then(([welcome, version]) => {
        if (active) {
          setInfo({ message: welcome.message, version: version.version })
        }
      })
      .catch((requestError: unknown) => {
        if (active && !controller.signal.aborted) {
          setError(normalizeApiError(requestError))
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [reloadKey])

  return {
    info,
    loading,
    error,
    retry: () => {
      setLoading(true)
      setError(null)
      setReloadKey((key) => key + 1)
    },
  }
}

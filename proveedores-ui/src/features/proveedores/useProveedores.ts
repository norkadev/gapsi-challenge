import { useCallback, useEffect, useRef, useState } from 'react'
import { normalizeApiError, type ApiError } from '../../shared/api/httpClient'
import {
  createProveedor,
  deleteProveedor,
  getProveedores,
} from './proveedoresApi'
import type { Proveedor, ProveedorRequest } from './proveedor.types'

function mergeById(current: Proveedor[], incoming: Proveedor[]): Proveedor[] {
  const providersById = new Map(current.map((provider) => [provider.id, provider]))
  incoming.forEach((provider) => providersById.set(provider.id, provider))
  return [...providersById.values()]
}

// Patrón de diseño: Custom Hook
export function useProveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [initialLoading, setInitialLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const nextPage = useRef(0)
  const requestedPages = useRef(new Set<number>())
  const active = useRef(true)

  const loadPage = useCallback(async (page: number, replace: boolean) => {
    if (requestedPages.current.has(page)) {
      return
    }

    requestedPages.current.add(page)
    try {
      const result = await getProveedores(page, 20)
      if (!active.current) {
        return
      }

      setProveedores((current) =>
        replace ? mergeById([], result.content) : mergeById(current, result.content),
      )
      setTotalElements(result.totalElements)
      setHasMore(!result.last)
      nextPage.current = result.number + 1
      setError(null)
    } catch (requestError: unknown) {
      if (active.current) {
        setError(normalizeApiError(requestError))
      }
    } finally {
      requestedPages.current.delete(page)
      if (active.current) {
        setInitialLoading(false)
        setLoadingMore(false)
      }
    }
  }, [])

  useEffect(() => {
    active.current = true
    requestedPages.current.add(0)
    const controller = new AbortController()
    getProveedores(0, 20, controller.signal)
      .then((result) => {
        if (!active.current) return
        setProveedores(mergeById([], result.content))
        setTotalElements(result.totalElements)
        setHasMore(!result.last)
        nextPage.current = result.number + 1
      })
      .catch((requestError: unknown) => {
        if (active.current && !controller.signal.aborted) {
          setError(normalizeApiError(requestError))
        }
      })
      .finally(() => {
        requestedPages.current.delete(0)
        if (active.current) {
          setInitialLoading(false)
        }
      })
    return () => {
      active.current = false
      controller.abort()
    }
  }, [])

  const loadNextPage = useCallback(() => {
    if (
      !hasMore ||
      initialLoading ||
      loadingMore ||
      requestedPages.current.has(nextPage.current)
    ) {
      return
    }
    setLoadingMore(true)
    return loadPage(nextPage.current, false)
  }, [hasMore, initialLoading, loadingMore, loadPage])

  const addProveedor = useCallback(async (request: ProveedorRequest) => {
    const created = await createProveedor(request)
    setProveedores((current) => mergeById([created], current))
    setTotalElements((current) => current + 1)
  }, [])

  const removeProveedor = useCallback(async (id: number) => {
    await deleteProveedor(id)
    setProveedores((current) => current.filter((provider) => provider.id !== id))
    setTotalElements((current) => Math.max(0, current - 1))

    requestedPages.current.clear()
    nextPage.current = 0
    setHasMore(true)
    setInitialLoading(true)
    await loadPage(0, true)
  }, [loadPage])

  const dismissError = useCallback(() => setError(null), [])

  const retry = useCallback(() => {
    if (requestedPages.current.has(0)) return
    setError(null)
    setHasMore(true)
    setInitialLoading(proveedores.length === 0)
    return loadPage(0, true)
  }, [loadPage, proveedores.length])

  return {
    proveedores,
    totalElements,
    initialLoading,
    loadingMore,
    hasMore,
    error,
    loadNextPage,
    retry,
    addProveedor,
    removeProveedor,
    dismissError,
  }
}

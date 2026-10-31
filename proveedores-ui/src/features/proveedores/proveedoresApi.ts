import { httpClient } from '../../shared/api/httpClient'
import type { Proveedor, ProveedorPage, ProveedorRequest } from './proveedor.types'

// Patrón de diseño: Facade
export async function getProveedores(
  page: number,
  size = 20,
  signal?: AbortSignal,
): Promise<ProveedorPage> {
  const response = await httpClient.get<ProveedorPage>('/api/v1/proveedores', {
    params: { page, size },
    signal,
  })
  return response.data
}

export async function getAllProveedores(size = 20): Promise<Proveedor[]> {
  const proveedoresById = new Map<number, Proveedor>()
  let page = 0
  let last = false

  while (!last) {
    const result = await getProveedores(page, size)
    result.content.forEach((proveedor) =>
      proveedoresById.set(proveedor.id, proveedor),
    )
    last = result.last
    page = result.number + 1
  }

  return [...proveedoresById.values()]
}

export async function createProveedor(
  proveedor: ProveedorRequest,
): Promise<Proveedor> {
  const response = await httpClient.post<Proveedor>(
    '/api/v1/proveedores',
    proveedor,
  )
  return response.data
}

export async function deleteProveedor(id: number): Promise<void> {
  await httpClient.delete(`/api/v1/proveedores/${id}`)
}

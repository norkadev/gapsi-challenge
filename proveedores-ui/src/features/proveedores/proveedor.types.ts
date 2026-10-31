export interface Proveedor {
  id: number
  nombre: string
  razonSocial: string
  direccion: string
}

export type ProveedorRequest = Omit<Proveedor, 'id'>

interface PageSort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

interface PageableMetadata {
  pageNumber: number
  pageSize: number
  sort: PageSort
  offset: number
  paged: boolean
  unpaged: boolean
}

export interface ProveedorPage {
  content: Proveedor[]
  pageable: PageableMetadata
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: PageSort
  numberOfElements: number
  first: boolean
  empty: boolean
}

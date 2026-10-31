import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import {
  CircularProgress,
  Fade,
  IconButton,
  Paper,
  TableContainer,
  Tooltip,
  Typography,
  Box,
} from '@mui/material'
import { useEffect, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Proveedor } from './proveedor.types'

interface ProveedorListProps {
  proveedores: Proveedor[]
  initialLoading: boolean
  loadingMore: boolean
  hasMore: boolean
  onLoadMore: () => void | Promise<void>
  onDelete: (proveedor: Proveedor) => void
}

const rowHeight = 62

export function ProveedorList({
  proveedores,
  initialLoading,
  loadingMore,
  hasMore,
  onLoadMore,
  onDelete,
}: ProveedorListProps) {
  const scrollElement = useRef<HTMLDivElement>(null)
  // TanStack Virtual exposes a mutable virtualizer controller, not memoizable state.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: proveedores.length + (hasMore ? 1 : 0),
    getScrollElement: () => scrollElement.current,
    estimateSize: () => rowHeight,
    overscan: 6,
  })
  const virtualRows = virtualizer.getVirtualItems()

  useEffect(() => {
    const lastRow = virtualRows.at(-1)
    if (
      lastRow &&
      lastRow.index >= proveedores.length - 4 &&
      hasMore &&
      !initialLoading &&
      !loadingMore
    ) {
      void onLoadMore()
    }
  }, [
    hasMore,
    initialLoading,
    loadingMore,
    onLoadMore,
    proveedores.length,
    virtualRows,
  ])

  if (initialLoading && proveedores.length === 0) {
    return (
      <Paper className="provider-table-empty" variant="outlined">
        <CircularProgress size={28} aria-label="Cargando proveedores" />
        <Typography color="text.secondary">Cargando proveedores…</Typography>
      </Paper>
    )
  }

  if (proveedores.length === 0) {
    return (
      <Paper className="provider-table-empty" variant="outlined">
        <GroupsRoundedIcon color="disabled" sx={{ fontSize: 44 }} />
        <Typography variant="h2">Aún no hay proveedores</Typography>
        <Typography color="text.secondary">
          Agrega un proveedor para comenzar.
        </Typography>
      </Paper>
    )
  }

  return (
    <Fade in timeout={300}>
      <TableContainer
        ref={scrollElement}
        component={Paper}
        variant="outlined"
        className="provider-table-scroll"
      >
        <Box
          role="table"
          aria-label="Lista de proveedores"
          className="provider-table"
        >
          <Box role="rowgroup" className="provider-table__head">
            <Box role="row" className="provider-table__header-row">
              <Box role="columnheader" className="provider-table__name">
                Nombre
              </Box>
              <Box role="columnheader" className="provider-table__reason">
                Razón social
              </Box>
              <Box role="columnheader" className="provider-table__address">
                Dirección
              </Box>
              <Box
                role="columnheader"
                className="provider-table__actions"
                sx={{ textAlign: 'center' }}
              >
                Acciones
              </Box>
            </Box>
          </Box>
          <Box
            role="rowgroup"
            className="provider-table__body"
            style={{ height: virtualizer.getTotalSize() }}
          >
            {virtualRows.map((virtualRow) => {
              const proveedor = proveedores[virtualRow.index]
              if (!proveedor) {
                return (
                  <Box
                    role="row"
                    key="loading-next-page"
                    className="provider-table__row provider-table__loading-row"
                    style={{
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <Box role="cell" className="provider-table__loading-cell">
                      <CircularProgress size={18} />
                      <span className="sr-only">Cargando más proveedores</span>
                    </Box>
                  </Box>
                )
              }

              return (
                <Box
                  role="row"
                  key={proveedor.id}
                  className="provider-table__row"
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                >
                  <Box role="cell" className="provider-table__name">
                    <Tooltip title={proveedor.nombre} placement="top" enterDelay={500}>
                      <Typography noWrap variant="body2">
                        {proveedor.nombre}
                      </Typography>
                    </Tooltip>
                  </Box>
                  <Box role="cell" className="provider-table__reason">
                    <Tooltip
                      title={proveedor.razonSocial}
                      placement="top"
                      enterDelay={500}
                    >
                      <Typography noWrap variant="body2">
                        {proveedor.razonSocial}
                      </Typography>
                    </Tooltip>
                  </Box>
                  <Box role="cell" className="provider-table__address">
                    <Tooltip title={proveedor.direccion} placement="top" enterDelay={500}>
                      <Typography noWrap variant="body2">
                        {proveedor.direccion}
                      </Typography>
                    </Tooltip>
                  </Box>
                  <Box
                    role="cell"
                    className="provider-table__actions provider-actions"
                  >
                    <Tooltip title={`Eliminar ${proveedor.nombre}`}>
                      <IconButton
                        color="secondary"
                        size="small"
                        aria-label={`Eliminar proveedor ${proveedor.nombre}`}
                        onClick={() => onDelete(proveedor)}
                      >
                        <DeleteOutlineRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Box>
      </TableContainer>
    </Fade>
  )
}

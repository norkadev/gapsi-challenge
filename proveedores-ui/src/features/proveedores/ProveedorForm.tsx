import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grow,
  Stack,
  TextField,
} from '@mui/material'
import { useState, type FormEvent } from 'react'
import { ApiError } from '../../shared/api/httpClient'
import type { ProveedorRequest } from './proveedor.types'

interface ProveedorFormProps {
  open: boolean
  onClose: () => void
  onCreate: (request: ProveedorRequest) => Promise<void>
  onError: (message: string) => void
}

const emptyValues: ProveedorRequest = {
  nombre: '',
  razonSocial: '',
  direccion: '',
}

export function ProveedorForm({
  open,
  onClose,
  onCreate,
  onError,
}: ProveedorFormProps) {
  const [values, setValues] = useState<ProveedorRequest>(emptyValues)
  const [nameError, setNameError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ProveedorRequest, string>>
  >({})
  const [submitting, setSubmitting] = useState(false)

  const updateField = (field: keyof ProveedorRequest, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: undefined }))
    if (field === 'nombre') {
      setNameError('')
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errors: Partial<Record<keyof ProveedorRequest, string>> = {}
    if (!values.nombre.trim()) errors.nombre = 'El nombre es obligatorio.'
    if (!values.razonSocial.trim()) {
      errors.razonSocial = 'La razón social es obligatoria.'
    }
    if (!values.direccion.trim()) {
      errors.direccion = 'La dirección es obligatoria.'
    }
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      await onCreate({
        nombre: values.nombre.trim(),
        razonSocial: values.razonSocial.trim(),
        direccion: values.direccion.trim(),
      })
      setValues(emptyValues)
      setNameError('')
      setFieldErrors({})
      onClose()
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 409) {
        setNameError(error.message)
      } else {
        onError(error instanceof Error ? error.message : 'No se pudo crear el proveedor.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!submitting) {
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="create-provider-title"
    >
      <Grow in={open} timeout={220}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <DialogTitle id="create-provider-title">
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <AddCircleOutlineRoundedIcon color="primary" />
              <span>Agregar proveedor</span>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2.25} sx={{ pt: 1 }}>
              <TextField
                autoFocus
                required
                fullWidth
                label="Nombre"
                value={values.nombre}
                onChange={(event) => updateField('nombre', event.target.value)}
                error={Boolean(nameError || fieldErrors.nombre)}
                helperText={nameError || fieldErrors.nombre || ' '}
              />
              <TextField
                required
                fullWidth
                label="Razón social"
                value={values.razonSocial}
                onChange={(event) =>
                  updateField('razonSocial', event.target.value)
                }
                error={Boolean(fieldErrors.razonSocial)}
                helperText={fieldErrors.razonSocial || ' '}
              />
              <TextField
                required
                fullWidth
                label="Dirección"
                value={values.direccion}
                onChange={(event) => updateField('direccion', event.target.value)}
                error={Boolean(fieldErrors.direccion)}
                helperText={fieldErrors.direccion || ' '}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={handleClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Guardando…' : 'Guardar proveedor'}
            </Button>
          </DialogActions>
        </Box>
      </Grow>
    </Dialog>
  )
}

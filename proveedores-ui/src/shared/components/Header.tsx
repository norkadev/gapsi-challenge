import { Box, Tab, Tabs, Typography } from '@mui/material'
import gapsiLogo from '../../assets/logo-gapsi.png'

export type AppPage = 'welcome' | 'proveedores'

interface HeaderProps {
  page: AppPage
  onNavigate: (page: AppPage) => void
}

export function Header({ page, onNavigate }: HeaderProps) {
  return (
    <header className="app-header">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          width: 'min(1180px, calc(100% - 40px))',
          minHeight: 62,
          mx: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            component="img"
            src={gapsiLogo}
            alt="Logo de Gapsi"
            sx={{ width: 78, height: 40, objectFit: 'contain' }}
          />
          <Typography component="span" sx={{ fontSize: 15, fontWeight: 600 }}>
            e-Commerce Gapsi
          </Typography>
        </Box>
        <Tabs
          value={page}
          onChange={(_, value: AppPage) => onNavigate(value)}
          aria-label="Secciones de la aplicación"
          sx={{
            minHeight: 62,
            '& .MuiTab-root': { minWidth: 92, minHeight: 62, px: 1.5 },
          }}
        >
          <Tab value="welcome" label="Bienvenida" />
          <Tab value="proveedores" label="Proveedores" />
        </Tabs>
      </Box>
    </header>
  )
}

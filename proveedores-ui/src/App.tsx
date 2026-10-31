import { CssBaseline, ThemeProvider } from '@mui/material'
import { useState } from 'react'
import { ProveedoresPage } from './features/proveedores/ProveedoresPage'
import { WelcomePage } from './features/welcome/WelcomePage'
import { Header, type AppPage } from './shared/components/Header'
import { theme } from './shared/theme'

function App() {
  const [page, setPage] = useState<AppPage>('welcome')

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-shell">
        <Header page={page} onNavigate={setPage} />
        <main className="app-main">
          {page === 'welcome' ? (
            <WelcomePage onContinue={() => setPage('proveedores')} />
          ) : (
            <ProveedoresPage />
          )}
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './context/app.provider.tsx'
import ErrorBoundary from './components/ErrorBoundary/ErrorBounddary.tsx'
import i18n from './i18n'
import { I18nProvider } from '@lingui/react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <ErrorBoundary>
            <I18nProvider i18n={i18n}>
              <App />
            </I18nProvider>
          </ErrorBoundary>
        </AppProvider>
        <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)

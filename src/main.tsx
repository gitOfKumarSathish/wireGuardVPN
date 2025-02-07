import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import ErrorBoundary from './ErrorBoundary.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider maxSnack={3} anchorOrigin={{
        vertical: 'top',  // Options: 'top', 'bottom'
        horizontal: 'right', // Options: 'left', 'center', 'right'
      }}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </SnackbarProvider>
    </QueryClientProvider>
  </StrictMode>,
);

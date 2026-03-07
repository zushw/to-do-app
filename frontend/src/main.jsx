import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppRoutes } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </StrictMode>,
);
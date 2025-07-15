import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { Toaster } from "@/components/ui/toaster";

// IMPORTANDO PROVIDERS
import { AuthProvider } from '@/contexts/AuthContext';
import { CommunityProvider } from '@/contexts/CommunityContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CommunityProvider>
        <App />
        <Toaster />
      </CommunityProvider>
    </AuthProvider>
  </React.StrictMode>
);

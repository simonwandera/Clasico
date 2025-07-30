import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
          <div className="bg-gradient-to-br from-gray-50 to-gray-300 dark:from-gray-900 dark:to-gray-800 h-full">
              <App />
          </div>
      </QueryClientProvider>
  </StrictMode>,
)
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
          <div className="bg-gradient-to-br from-gray-300 to-gray-400 h-full">
              <App />
          </div>
      </QueryClientProvider>
  </StrictMode>,
)
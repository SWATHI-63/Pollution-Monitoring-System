import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ThresholdProvider } from './context/ThresholdContext';
import { FacilityProvider } from './context/FacilityContext';
import { AlertProvider } from './context/AlertContext';
import { SimulationProvider } from './context/SimulationContext';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ThresholdProvider>
            <FacilityProvider>
              <AlertProvider>
                <SimulationProvider>
                  <BrowserRouter>
                    <AppRoutes />
                  </BrowserRouter>
                </SimulationProvider>
              </AlertProvider>
            </FacilityProvider>
          </ThresholdProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;


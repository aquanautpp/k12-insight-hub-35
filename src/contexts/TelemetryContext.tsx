import React, { createContext, useContext, ReactNode } from 'react';

interface TelemetryEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp: Date;
}

interface TelemetryContextType {
  trackEvent: (event: string, properties?: Record<string, any>) => void;
  trackPageView: (page: string) => void;
  trackUserAction: (action: string, context?: string, properties?: Record<string, any>) => void;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
};

interface TelemetryProviderProps {
  children: ReactNode;
}

export const TelemetryProvider: React.FC<TelemetryProviderProps> = ({ children }) => {
  const trackEvent = (event: string, properties?: Record<string, any>) => {
    const telemetryEvent: TelemetryEvent = {
      event,
      properties,
      timestamp: new Date(),
    };
    
    // Por enquanto, apenas log no console. Em produção, enviar para serviço de analytics
    console.log('📊 Telemetria:', telemetryEvent);
    
    // Salvar eventos localmente para debug
    const events = JSON.parse(localStorage.getItem('telemetryEvents') || '[]');
    events.push(telemetryEvent);
    localStorage.setItem('telemetryEvents', JSON.stringify(events.slice(-100))); // Manter últimos 100 eventos
  };

  const trackPageView = (page: string) => {
    trackEvent('page_view', { page });
  };

  const trackUserAction = (action: string, context?: string, properties?: Record<string, any>) => {
    trackEvent('user_action', { 
      action, 
      context,
      ...properties 
    });
  };

  return (
    <TelemetryContext.Provider value={{ trackEvent, trackPageView, trackUserAction }}>
      {children}
    </TelemetryContext.Provider>
  );
};
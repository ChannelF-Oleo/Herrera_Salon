// src/components/common/ErrorBoundary.jsx

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import '../../styles/ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el state para mostrar la UI de error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Captura detalles del error
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log del error para debugging
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
    
    // Aquí podrías enviar el error a un servicio de logging
    // como Sentry, LogRocket, etc.
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={() => this.setState({ hasError: false, error: null, errorInfo: null })}
        />
      );
    }

    return this.props.children;
  }
}

// Componente de UI para mostrar cuando hay error
const ErrorFallback = ({ error, errorInfo, resetError }) => {
  const handleGoHome = () => {
    resetError();
    // Usar window.location en lugar de navigate para evitar errores de contexto
    window.location.href = '/';
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="error-page">
      <div className="error-card">
        {/* Icono de error */}
        <div className="error-icon-wrapper">
          <AlertTriangle className="error-icon" />
        </div>

        {/* Título */}
        <h1 className="error-title">
          ¡Oops! Algo salió mal
        </h1>

        {/* Descripción */}
        <p className="error-description">
          Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado y 
          estamos trabajando para solucionarlo.
        </p>

        {/* Detalles del error (solo en desarrollo) */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="error-details">
            <summary>
              Ver detalles técnicos
            </summary>
            <div className="error-details-content">
              <div className="error-details-label">Error:</div>
              <div style={{ marginBottom: '0.5rem' }}>{error.toString()}</div>
              {errorInfo && (
                <>
                  <div className="error-details-label">Stack Trace:</div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{errorInfo.componentStack}</div>
                </>
              )}
            </div>
          </details>
        )}

        {/* Botones de acción */}
        <div className="error-actions">
          <button
            onClick={handleReload}
            className="error-btn error-btn-secondary"
          >
            <RefreshCw style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
            Recargar página
          </button>
          
          <button
            onClick={handleGoHome}
            className="error-btn error-btn-primary"
          >
            <Home style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
            Ir al inicio
          </button>
        </div>

        {/* Información de contacto */}
        <p className="error-contact">
          Si el problema persiste, contáctanos en{' '}
          <a 
            href="mailto:soporte@fireforgerd.com" 
            className="error-contact-link"
          >
            soporte@fireforgerd.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default ErrorBoundary;
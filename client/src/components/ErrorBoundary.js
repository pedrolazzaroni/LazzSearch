import React, { Component } from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log to console for debugging
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    
    // Here you could also send the error to a logging service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2>Ops! Algo deu errado.</h2>
            <p>Desculpe pelo transtorno. Tente recarregar a página ou voltar à página inicial.</p>
            
            <div className="error-actions">
              <button onClick={() => window.location.reload()}>
                Recarregar página
              </button>
              <button onClick={() => window.location.href = '/'}>
                Voltar ao início
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Detalhes técnicos</summary>
                <pre>{this.state.error && this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const isActive = path => location.pathname === path;
  const [showDevTools, setShowDevTools] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);
  
  // Função para ativar ferramentas de desenvolvedor com clique triplo no logo
  const handleLogoClick = () => {
    if (!showDevTools) {
      const lastClick = parseInt(localStorage.getItem('lastLogoClick') || '0');
      const now = Date.now();
      
      if (now - lastClick < 500) {
        const clickCount = parseInt(localStorage.getItem('logoClickCount') || '0') + 1;
        localStorage.setItem('logoClickCount', clickCount.toString());
        
        if (clickCount >= 3) {
          setShowDevTools(true);
          localStorage.removeItem('logoClickCount');
          alert('Ferramentas de desenvolvedor ativadas');
        }
      } else {
        localStorage.setItem('logoClickCount', '1');
      }
      
      localStorage.setItem('lastLogoClick', now.toString());
    }
  };
  
  // Função para limpar o cache da API
  const clearApiCache = async () => {
    try {
      setClearingCache(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/clear-cache`);
      const data = await response.json();
      alert(`Cache limpo: ${data.message}`);
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      alert('Erro ao limpar cache. Verifique o console.');
    } finally {
      setClearingCache(false);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/" className="logo-link" onClick={handleLogoClick}>
            <span className="logo-text">Lazz<span className="logo-highlight">Search</span></span>
          </Link>
        </div>
        <nav className="nav-links">
          <Link to="/" className={isActive('/') ? 'active' : ''}>Busca</Link>
          <Link to="/about" className={isActive('/about') ? 'active' : ''}>Sobre</Link>
          {showDevTools && (
            <button 
              className="dev-tool-button" 
              onClick={clearApiCache} 
              disabled={clearingCache}
            >
              {clearingCache ? 'Limpando...' : 'Limpar Cache'}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

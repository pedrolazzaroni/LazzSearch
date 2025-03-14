import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <span className="logo-text">Lazz<span className="logo-highlight">Search</span></span>
        </div>
        <nav className="nav-links">
          <a href="/" className="active">Busca</a>
          <a href="/about">Sobre</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;

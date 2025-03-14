import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <span className="footer-logo">LazzSearch</span>
          <p className="footer-description">
            Ferramenta de busca e comparação de preços com dados reais do Google Shopping.
          </p>
        </div>
        <div className="footer-right">
          <div className="footer-links">
            <h4>Links</h4>
            <ul>
              <li><Link to="/">Início</Link></li>
              <li><Link to="/about">Sobre</Link></li>
              {/* Links externos para recursos adicionais */}
              <li><a href="https://www.google.com/shopping" target="_blank" rel="noopener noreferrer">Google Shopping</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Informações</h4>
            <p>Ferramenta educacional para web scraping e comparação de preços</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} LazzSearch. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;

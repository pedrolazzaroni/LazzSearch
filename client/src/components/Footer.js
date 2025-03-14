import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <span className="footer-logo">LazzSearch</span>
          <p className="footer-description">
            Encontre e compare preços de produtos em diversas lojas online.
          </p>
        </div>
        <div className="footer-right">
          <div className="footer-links">
            <h4>Links Úteis</h4>
            <ul>
              <li><a href="/">Início</a></li>
              <li><a href="/about">Sobre</a></li>
              <li><a href="/terms">Termos de Uso</a></li>
              <li><a href="/privacy">Política de Privacidade</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Contato</h4>
            <a href="mailto:contato@lazzsearch.com">contato@lazzsearch.com</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} LazzSearch. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;

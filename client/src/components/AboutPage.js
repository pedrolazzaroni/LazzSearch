import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <h1>Sobre o LazzSearch</h1>
      
      <section className="about-section">
        <h2>O que é o LazzSearch?</h2>
        <p>
          LazzSearch é uma ferramenta de comparação de preços que ajuda você a encontrar as melhores ofertas 
          online. Nossa aplicação busca produtos em diversas lojas e apresenta os resultados em um formato 
          fácil de comparar, economizando seu tempo e dinheiro.
        </p>
      </section>
      
      <section className="about-section">
        <h2>Como funciona?</h2>
        <p>
          Quando você digita um termo de busca, nosso sistema:
        </p>
        <ol>
          <li>Consulta dados de produtos em tempo real usando nossa tecnologia de web scraping</li>
          <li>Organiza e filtra os resultados das principais lojas online</li>
          <li>Apresenta os produtos ordenados por preço, avaliação ou relevância</li>
          <li>Permite que você acesse diretamente a página da oferta na loja original</li>
        </ol>
      </section>
      
      <section className="about-section">
        <h2>Por que usar o LazzSearch?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Economia</h3>
            <p>Compare preços facilmente e encontre as melhores ofertas</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Rapidez</h3>
            <p>Economize tempo buscando em várias lojas de uma só vez</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Transparência</h3>
            <p>Veja avaliações e informações completas sobre os produtos</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Organização</h3>
            <p>Filtre e ordene resultados conforme sua necessidade</p>
          </div>
        </div>
      </section>
      
      <section className="about-section">
        <h2>Tecnologias utilizadas</h2>
        <div className="tech-stack">
          <span className="tech-badge">React</span>
          <span className="tech-badge">Node.js</span>
          <span className="tech-badge">Express</span>
          <span className="tech-badge">Python</span>
          <span className="tech-badge">Web Scraping</span>
          <span className="tech-badge">RESTful API</span>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

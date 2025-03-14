import React, { useState, useEffect } from 'react';
import './SearchBar.css';
import config from '../config';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Carregar histórico de buscas do localStorage
  useEffect(() => {
    if (config.features.enableSearchHistory) {
      try {
        const savedHistory = JSON.parse(localStorage.getItem('lazzsearch_history') || '[]');
        setHistory(savedHistory);
      } catch (err) {
        console.error('Erro ao carregar histórico:', err);
        setHistory([]);
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowHistory(false);
    }
  };
  
  const handleHistorySelect = (savedQuery) => {
    setQuery(savedQuery);
    onSearch(savedQuery);
    setShowHistory(false);
  };
  
  // Mostrar histórico quando o input recebe foco e tem histórico
  const handleInputFocus = () => {
    if (history.length > 0) {
      setShowHistory(true);
    }
  };
  
  // Fechar histórico ao clicar fora
  const handleClickOutside = (e) => {
    if (!e.target.closest('.search-history') && !e.target.closest('.search-input')) {
      setShowHistory(false);
    }
  };
  
  // Adicionar evento para detectar clique fora
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Formatação da data do histórico
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Hoje, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Ontem, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="search-container">
      <div className="search-intro">
        <h1>Encontre os melhores preços na internet</h1>
        <p>Compare preços entre diversas lojas e economize em suas compras</p>
      </div>
      
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-container">
          <input
            type="text"
            className="search-input"
            placeholder="O que você está procurando hoje?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleInputFocus}
            required
          />
          <button type="submit" className="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="white"/>
            </svg>
          </button>
          
          {showHistory && history.length > 0 && (
            <div className="search-history">
              <h4>Buscas recentes</h4>
              <ul>
                {history.map((item, index) => (
                  <li key={index} onClick={() => handleHistorySelect(item.query)}>
                    <span className="history-query">{item.query}</span>
                    <span className="history-date">{formatDate(item.timestamp)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="search-suggestions">
          <span>Sugestões:</span>
          {config.ui.popularCategories.map((category, index) => (
            <button 
              key={index} 
              type="button" 
              onClick={() => { 
                setQuery(category); 
                handleSubmit({ preventDefault: () => {} }); 
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;

import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
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
            required
          />
          <button type="submit" className="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="white"/>
            </svg>
          </button>
        </div>
        <div className="search-suggestions">
          <span>Sugestões:</span>
          <button type="button" onClick={() => { setQuery('smartphone'); handleSubmit({ preventDefault: () => {} }); }}>
            Smartphone
          </button>
          <button type="button" onClick={() => { setQuery('notebook'); handleSubmit({ preventDefault: () => {} }); }}>
            Notebook
          </button>
          <button type="button" onClick={() => { setQuery('tv 4k'); handleSubmit({ preventDefault: () => {} }); }}>
            TV 4K
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;

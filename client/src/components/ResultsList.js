import React, { useState } from 'react';
import ProductCard from './ProductCard';
import './ResultsList.css';

const ResultsList = ({ products }) => {
  const [sortBy, setSortBy] = useState('price_asc');
  const [filterStore, setFilterStore] = useState('');

  // Get unique store names
  const stores = [...new Set(products.map(product => product.store))];

  // Sort and filter products
  const getSortedAndFilteredProducts = () => {
    let filteredProducts = [...products];
    
    // Apply store filter
    if (filterStore) {
      filteredProducts = filteredProducts.filter(p => p.store === filterStore);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        return filteredProducts.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return filteredProducts.sort((a, b) => b.price - a.price);
      case 'rating':
        return filteredProducts.sort((a, b) => b.rating - a.rating);
      default:
        return filteredProducts;
    }
  };

  const sortedAndFilteredProducts = getSortedAndFilteredProducts();

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Resultados encontrados ({sortedAndFilteredProducts.length})</h2>
        <div className="filter-controls">
          <div className="sort-control">
            <label htmlFor="sort">Ordenar por:</label>
            <select 
              id="sort" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="price_asc">Menor preço</option>
              <option value="price_desc">Maior preço</option>
              <option value="rating">Melhor avaliação</option>
            </select>
          </div>
          <div className="store-filter">
            <label htmlFor="store">Filtrar loja:</label>
            <select 
              id="store" 
              value={filterStore} 
              onChange={(e) => setFilterStore(e.target.value)}
            >
              <option value="">Todas as lojas</option>
              {stores.map(store => (
                <option key={store} value={store}>{store}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="products-grid">
        {sortedAndFilteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ResultsList;

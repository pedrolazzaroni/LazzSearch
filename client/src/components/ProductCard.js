import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`star-${i}`} className="star full">★</span>);
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(<span key="half-star" className="star half">★</span>);
    }
    
    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }
    
    return stars;
  };
  
  // Função para visitar URL do produto
  const handleCardClick = () => {
    window.open(product.url, '_blank');
  };
  
  // Função para salvar produto sem propagar o clique
  const handleSaveClick = (e) => {
    e.stopPropagation();
    // Aqui viria a lógica para salvar o produto
    console.log('Produto salvo:', product.id);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          loading="lazy" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://via.placeholder.com/200x200/FF5500/FFFFFF?text=${encodeURIComponent(product.name)}`;
          }}
        />
        <div className="product-store-tag">{product.store}</div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <div className="stars">{renderStars(product.rating)}</div>
          <span className="reviews-count">({product.reviews})</span>
        </div>
        <div className="product-price">{formatCurrency(product.price)}</div>
        <p className="product-description">{product.description}</p>
      </div>
      <div className="product-actions">
        <a 
          href={product.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="view-deal-btn"
          onClick={(e) => e.stopPropagation()}
        >
          Ver oferta
        </a>
        <button className="save-btn" onClick={handleSaveClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

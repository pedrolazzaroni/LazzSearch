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
  
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.imageUrl} alt={product.name} loading="lazy" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-store">
          <span className="store-name">{product.store}</span>
        </div>
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
        >
          Ver oferta
        </a>
        <button className="save-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

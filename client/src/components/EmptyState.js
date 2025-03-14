import React from 'react';
import './EmptyState.css';

const EmptyState = ({ message }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="#dadce0"/>
        </svg>
      </div>
      <p className="empty-state-message">{message}</p>
      <p className="empty-state-suggestion">Tente ajustar os termos da busca ou buscar por outro produto.</p>
    </div>
  );
};

export default EmptyState;

import React from 'react';
import styles from './Card.module.css'; // Import CSS Module

const Card = ({ card, onClick, isFlipped }) => {
  return (
    <div
      className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
      onClick={onClick}
    >
      {isFlipped ? card : "?"}  {/* Show card value if flipped */}
    </div>
  );
};

export default Card;


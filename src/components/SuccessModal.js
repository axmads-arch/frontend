import React from 'react';

export default function SuccessModal({ onClose }) {
  return (
    <div className="success-overlay">
      <div className="success-box">
        <div className="success-icon">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#1a6b63" strokeWidth="2.5">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        </div>
        <div className="success-title">Заказ принят!</div>
        <div className="success-text">
          Ваш заказ готовится. Ожидайте курьера через 25–35 минут.
        </div>
        <button className="success-btn" onClick={onClose}>Отлично!</button>
      </div>
    </div>
  );
}

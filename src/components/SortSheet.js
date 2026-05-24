import React from 'react';

export default function SortSheet({ opts, selected, onSelect, onReset, onApply, onClose }) {
  return (
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sheet">
        <div className="sheet-handle" />
        <div className="sheet-top">
          <span className="sheet-title">Сортировка</span>
          <button className="sheet-reset" onClick={onReset}>Сбросить</button>
          <button className="sheet-close" onClick={onClose}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {opts.map(opt => (
          <div key={opt.id} className="sort-option" onClick={() => onSelect(opt.id)}>
            <span className="sort-label">{opt.label}</span>
            <div className={`radio-circle${selected === opt.id ? ' selected' : ''}`} />
          </div>
        ))}

        <button className="sheet-apply" onClick={onApply}>Фильтровать</button>
      </div>
    </div>
  );
}

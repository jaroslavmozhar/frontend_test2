import React, { useState } from 'react';

const SeriesCard = ({ series, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localSeries, setLocalSeries] = useState(series);
  const [hasUnsavedNotes, setHasUnsavedNotes] = useState(false);

  const handleWatchedChange = () => {
    const updated = { ...localSeries, watched: !localSeries.watched };
    setLocalSeries(updated);
    onUpdate(updated);
  };

  const handleRatingChange = (e) => {
    const updated = { ...localSeries, rating: parseInt(e.target.value) };
    setLocalSeries(updated);
    onUpdate(updated);
  };

  const handleNotesChange = (e) => {
    const updated = { ...localSeries, notes: e.target.value };
    setLocalSeries(updated);
    setHasUnsavedNotes(true);
  };

  const handleSaveNotes = () => {
    onUpdate(localSeries);
    setHasUnsavedNotes(false);
    setIsEditing(false);
  };

  const handleClearNotes = () => {
    if (window.confirm('Видалити всі нотатки?')) {
      const updated = { ...localSeries, notes: '' };
      setLocalSeries(updated);
      onUpdate(updated);
      setHasUnsavedNotes(false);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Видалити досьє "${localSeries.title}"?`)) {
      onDelete(localSeries.id);
    }
  };

  return (
    <div className="case-file">
      <span className="dosie-label">ДОСЬЄ</span>
      <button 
        className="delete-case-btn" 
        onClick={handleDelete}
        aria-label="Видалити досьє"
        title="Видалити досьє"
      >
        ✕
      </button>
      <div className="case-file-header">
        <input
          type="checkbox"
          className="case-checkbox"
          checked={localSeries.watched}
          onChange={handleWatchedChange}
          aria-label="Позначити як переглянуте"
        />
        <h3 className={`case-title ${localSeries.watched ? 'solved' : ''}`}>
          {localSeries.title}
        </h3>
      </div>

      {localSeries.watched && (
        <div className="rating-section">
          <label className="rating-label">
            Оцінка слідства:
          </label>
          <div className="rating-display">
            {localSeries.rating}/10
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={localSeries.rating}
            onChange={handleRatingChange}
            className="rating-slider"
            aria-label="Оцінка серіалу"
          />
        </div>
      )}

      <div className="notes-section">
        <label className="notes-label">
          Нотатки:
        </label>
        <textarea
          className="notes-textarea"
          placeholder="Додайте свої нотатки про розслідування..."
          value={localSeries.notes}
          onChange={handleNotesChange}
          onFocus={() => setIsEditing(true)}
          aria-label="Нотатки про серіал"
        />
        
        {(isEditing || localSeries.notes) && (
          <div className="notes-actions">
            <button 
              className="notes-btn save-notes-btn"
              onClick={handleSaveNotes}
              disabled={!hasUnsavedNotes}
            >
              💾 Зберегти нотатки
            </button>
            {localSeries.notes && (
              <button 
                className="notes-btn clear-notes-btn"
                onClick={handleClearNotes}
              >
                🗑️ Очистити
              </button>
            )}
          </div>
        )}
        
        {hasUnsavedNotes && (
          <div className="unsaved-indicator">
            ⚠ Незбережені зміни
          </div>
        )}
      </div>
    </div>
  );
};

export default SeriesCard;

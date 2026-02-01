import React, { useState } from 'react';

const SeriesCard = ({ series, onUpdate, onDelete }) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [localSeries, setLocalSeries] = useState(series);
  const [tempNotes, setTempNotes] = useState(series.notes);

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

  const handleStartEditing = () => {
    setTempNotes(localSeries.notes);
    setIsEditingNotes(true);
  };

  const handleCancelEditing = () => {
    setTempNotes(localSeries.notes);
    setIsEditingNotes(false);
  };

  const handleSaveNotes = () => {
    const updated = { ...localSeries, notes: tempNotes };
    setLocalSeries(updated);
    onUpdate(updated);
    setIsEditingNotes(false);
  };

  const handleDeleteNotes = () => {
    if (window.confirm('Видалити всі нотатки?')) {
      const updated = { ...localSeries, notes: '' };
      setLocalSeries(updated);
      onUpdate(updated);
      setTempNotes('');
      setIsEditingNotes(false);
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

      {/* Rating section - always visible */}
      <div className="rating-section">
        <label className="rating-label">
          Оцінка слідства:
        </label>
        <div className="rating-display">
          {localSeries.rating}/10
        </div>
        <input
          type="range"
          min="0"
          max="10"
          value={localSeries.rating}
          onChange={handleRatingChange}
          className="rating-slider"
          aria-label="Оцінка серіалу"
        />
      </div>

      {/* Notes section */}
      <div className="notes-section">
        <div className="notes-header">
          <label className="notes-label">Нотатки:</label>
          {!isEditingNotes && (
            <button 
              className="edit-notes-btn"
              onClick={handleStartEditing}
              title="Редагувати нотатки"
            >
              ✏️ Редагувати
            </button>
          )}
        </div>

        {!isEditingNotes ? (
          // Display mode
          localSeries.notes ? (
            <div className="notes-display">
              <p className="notes-text">{localSeries.notes}</p>
            </div>
          ) : (
            <div className="notes-empty" onClick={handleStartEditing}>
              <p>📝 Натисніть "Редагувати", щоб додати нотатки</p>
            </div>
          )
        ) : (
          // Edit mode
          <>
            <textarea
              className="notes-textarea"
              placeholder="Додайте свої нотатки про розслідування..."
              value={tempNotes}
              onChange={(e) => setTempNotes(e.target.value)}
              autoFocus
              aria-label="Нотатки про серіал"
            />
            
            <div className="notes-actions">
              <button 
                className="notes-btn save-notes-btn"
                onClick={handleSaveNotes}
              >
                💾 Зберегти
              </button>
              <button 
                className="notes-btn cancel-notes-btn"
                onClick={handleCancelEditing}
              >
                ✖️ Скасувати
              </button>
              {localSeries.notes && (
                <button 
                  className="notes-btn delete-notes-btn"
                  onClick={handleDeleteNotes}
                >
                  🗑️ Видалити
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SeriesCard;

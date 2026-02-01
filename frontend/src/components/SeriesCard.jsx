import React, { useState } from 'react';

const SeriesCard = ({ series, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localSeries, setLocalSeries] = useState(series);

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
  };

  const handleNotesBlur = () => {
    onUpdate(localSeries);
    setIsEditing(false);
  };

  return (
    <div className="case-file">
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
          onBlur={handleNotesBlur}
          onFocus={() => setIsEditing(true)}
          aria-label="Нотатки про серіал"
        />
      </div>
    </div>
  );
};

export default SeriesCard;

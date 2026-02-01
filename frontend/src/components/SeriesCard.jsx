import React, { useState } from 'react';

const SeriesCard = ({ series, onUpdate, onDelete }) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [localSeries, setLocalSeries] = useState(series);
  const [newNoteText, setNewNoteText] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('Maria');

  // Ensure notes is an array
  const notes = Array.isArray(localSeries.notes) ? localSeries.notes : 
                localSeries.notes ? [{ author: 'Maria', text: localSeries.notes, timestamp: new Date().toISOString() }] : [];

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

  const handleAddNote = () => {
    if (newNoteText.trim()) {
      const newNote = {
        author: selectedAuthor,
        text: newNoteText.trim(),
        timestamp: new Date().toISOString()
      };
      
      const updatedNotes = [...notes, newNote];
      const updated = { ...localSeries, notes: updatedNotes };
      setLocalSeries(updated);
      onUpdate(updated);
      
      setNewNoteText('');
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = (index) => {
    if (window.confirm('Видалити цю нотатку?')) {
      const updatedNotes = notes.filter((_, i) => i !== index);
      const updated = { ...localSeries, notes: updatedNotes };
      setLocalSeries(updated);
      onUpdate(updated);
    }
  };

  const handleCancelNote = () => {
    setNewNoteText('');
    setIsAddingNote(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Видалити досьє "${localSeries.title}"?`)) {
      onDelete(localSeries.id);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('uk-UA', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

      {/* Notes section - Journal style */}
      <div className="notes-section">
        <div className="notes-header">
          <label className="notes-label">Журнал розслідування:</label>
          {!isAddingNote && (
            <button 
              className="add-note-btn"
              onClick={() => setIsAddingNote(true)}
              title="Додати нотатку"
            >
              ➕ Додати
            </button>
          )}
        </div>

        {/* Display existing notes */}
        {notes.length > 0 && (
          <div className="notes-journal">
            {notes.map((note, index) => (
              <div key={index} className={`journal-entry ${note.author.toLowerCase()}`}>
                <div className="journal-header">
                  <span className="journal-author">{note.author}</span>
                  <span className="journal-time">{formatDate(note.timestamp)}</span>
                  <button 
                    className="delete-note-btn"
                    onClick={() => handleDeleteNote(index)}
                    title="Видалити нотатку"
                  >
                    ✕
                  </button>
                </div>
                <p className="journal-text">{note.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add new note form */}
        {isAddingNote ? (
          <div className="add-note-form">
            <div className="author-selector">
              <label className="author-label">Автор:</label>
              <div className="author-options">
                <label className={`author-option ${selectedAuthor === 'Maria' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="author"
                    value="Maria"
                    checked={selectedAuthor === 'Maria'}
                    onChange={(e) => setSelectedAuthor(e.target.value)}
                  />
                  <span className="author-name maria">Maria</span>
                </label>
                <label className={`author-option ${selectedAuthor === 'Yaroslav' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="author"
                    value="Yaroslav"
                    checked={selectedAuthor === 'Yaroslav'}
                    onChange={(e) => setSelectedAuthor(e.target.value)}
                  />
                  <span className="author-name yaroslav">Yaroslav</span>
                </label>
              </div>
            </div>
            
            <textarea
              className="notes-textarea"
              placeholder="Додайте свої спостереження..."
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              autoFocus
              aria-label="Текст нотатки"
            />
            
            <div className="notes-actions">
              <button 
                className="notes-btn save-notes-btn"
                onClick={handleAddNote}
                disabled={!newNoteText.trim()}
              >
                💾 Зберегти
              </button>
              <button 
                className="notes-btn cancel-notes-btn"
                onClick={handleCancelNote}
              >
                ✖️ Скасувати
              </button>
            </div>
          </div>
        ) : (
          !notes.length && (
            <div className="notes-empty" onClick={() => setIsAddingNote(true)}>
              <p>📝 Розслідування розпочато. Додайте першу нотатку.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SeriesCard;

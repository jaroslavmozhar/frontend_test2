import React, { useState } from 'react';

const AddSeriesForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({
        id: Date.now().toString(),
        title: title.trim(),
        watched: false,
        rating: 0,
        notes: ''
      });
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-series-container">
      <label className="form-label">
        Нова справа:
      </label>
      <input
        type="text"
        className="crime-input"
        placeholder="Назва нового досьє..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Назва серіалу"
      />
      <button type="submit" className="crime-btn">
        ⚠ Додати до розслідування
      </button>
    </form>
  );
};

export default AddSeriesForm;

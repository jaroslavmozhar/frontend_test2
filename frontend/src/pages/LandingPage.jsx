import React, { useState, useEffect } from 'react';
import SeriesCard from '../components/SeriesCard';
import AddSeriesForm from '../components/AddSeriesForm';
import { mockSeries } from '../data/mock';
import '../styles/crime-theme.css';

const STORAGE_KEY = 'crime_series_archive';

const LandingPage = () => {
  const [series, setSeries] = useState([]);

  // Load data from LocalStorage or use mock data
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSeries(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading data:', error);
        setSeries(mockSeries);
      }
    } else {
      setSeries(mockSeries);
    }
  }, []);

  // Save to LocalStorage whenever series changes
  useEffect(() => {
    if (series.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(series));
    }
  }, [series]);

  const handleAddSeries = (newSeries) => {
    setSeries([newSeries, ...series]);
  };

  const handleUpdateSeries = (updatedSeries) => {
    setSeries(series.map(s => 
      s.id === updatedSeries.id ? updatedSeries : s
    ));
  };

  return (
    <div className="crime-scene-bg">
      <div className="investigators-header">
        <h1 className="investigators-title">
          Слідчі: Maria та Yaroslav
        </h1>
      </div>

      <div className="detective-board">
        <h2 className="archive-title">
          Архів Кримінальних Серіалів
        </h2>

        <AddSeriesForm onAdd={handleAddSeries} />

        {series.length > 0 ? (
          <div className="series-grid">
            {series.map((s) => (
              <SeriesCard
                key={s.id}
                series={s}
                onUpdate={handleUpdateSeries}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>Розслідування не розпочато. Додайте першу справу.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;

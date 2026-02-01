import React, { useState, useEffect } from 'react';
import SeriesCard from '../components/SeriesCard';
import AddSeriesForm from '../components/AddSeriesForm';
import DetectiveStrings from '../components/DetectiveStrings';
import { mockSeries } from '../data/mock';
import '../styles/crime-theme.css';

const STORAGE_KEY = 'crime_series_archive';
const WISHLIST_KEY = 'crime_series_wishlist';

// Helper function to migrate old note format to new format
const migrateNotes = (notes) => {
  if (!notes) return [];
  if (Array.isArray(notes)) return notes;
  if (typeof notes === 'string' && notes.trim()) {
    return [{
      author: 'Maria',
      text: notes,
      timestamp: new Date().toISOString()
    }];
  }
  return [];
};

const LandingPage = () => {
  const [series, setSeries] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState('archive');

  // Load data from LocalStorage or use mock data
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedWishlist = localStorage.getItem(WISHLIST_KEY);
    
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        // Migrate old format to new format
        const migratedData = parsedData.map(item => ({
          ...item,
          notes: migrateNotes(item.notes),
          rating: item.rating || 0
        }));
        setSeries(migratedData);
      } catch (error) {
        console.error('Error loading data:', error);
        const migratedMock = mockSeries.map(item => ({
          ...item,
          notes: migrateNotes(item.notes)
        }));
        setSeries(migratedMock);
      }
    } else {
      // No data in storage, use mock data
      const migratedMock = mockSeries.map(item => ({
        ...item,
        notes: migrateNotes(item.notes)
      }));
      setSeries(migratedMock);
    }

    if (storedWishlist) {
      try {
        const parsedWishlist = JSON.parse(storedWishlist);
        const migratedWishlist = parsedWishlist.map(item => ({
          ...item,
          notes: migrateNotes(item.notes),
          rating: item.rating || 0
        }));
        setWishlist(migratedWishlist);
      } catch (error) {
        console.error('Error loading wishlist:', error);
        setWishlist([]);
      }
    } else {
      setWishlist([]);
    }
  }, []);

  // Save to LocalStorage whenever series changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(series));
    console.log('✅ Archive saved:', series.length, 'items');
  }, [series]);

  // Save wishlist to LocalStorage
  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    console.log('✅ Wishlist saved:', wishlist.length, 'items');
  }, [wishlist]);

  const handleAddSeries = (newSeries) => {
    const seriesWithNotes = {
      ...newSeries,
      notes: [],
      rating: 0
    };
    
    if (activeTab === 'archive') {
      const updated = [seriesWithNotes, ...series];
      setSeries(updated);
    } else {
      const updated = [seriesWithNotes, ...wishlist];
      setWishlist(updated);
    }
  };

  const handleUpdateSeries = (updatedSeries) => {
    console.log('📝 Updating series:', updatedSeries);
    
    if (activeTab === 'archive') {
      const updated = series.map(s => 
        s.id === updatedSeries.id ? updatedSeries : s
      );
      setSeries(updated);
    } else {
      const updated = wishlist.map(s => 
        s.id === updatedSeries.id ? updatedSeries : s
      );
      setWishlist(updated);
    }
  };

  const handleDeleteSeries = (id) => {
    if (activeTab === 'archive') {
      setSeries(series.filter(s => s.id !== id));
    } else {
      setWishlist(wishlist.filter(s => s.id !== id));
    }
  };

  const currentList = activeTab === 'archive' ? series : wishlist;

  return (
    <div className="crime-scene-bg">
      <div className="investigators-header">
        <div className="investigators-container">
          <div className="investigators-glow"></div>
          <h1 className="investigators-title">
            <span className="investigators-label">СЛІДЧІ</span>
            <span className="investigators-names">
              <span className="investigator-name">MARIA</span>
              <span className="investigators-separator">×</span>
              <span className="investigator-name">YAROSLAV</span>
            </span>
          </h1>
          <div className="investigators-subtitle">ДЕПАРТАМЕНТ СЕРІЙНИХ ЗЛОЧИНІВ</div>
        </div>
      </div>

      <div className="detective-board" style={{ position: 'relative' }}>
        <DetectiveStrings />
        
        {/* Navigation Tabs */}
        <div className="evidence-tabs">
          <button 
            className={`evidence-tab ${activeTab === 'archive' ? 'active' : ''}`}
            onClick={() => setActiveTab('archive')}
          >
            <span className="tab-icon">📁</span>
            АРХІВ РОЗСЛІДУВАНЬ
            <span className="tab-count">{series.length}</span>
          </button>
          <button 
            className={`evidence-tab ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            <span className="tab-icon">📝</span>
            СПИСОК БАЖАНЬ
            <span className="tab-count">{wishlist.length}</span>
          </button>
        </div>

        <h2 className="archive-title">
          {activeTab === 'archive' ? 'Архів Кримінальних Серіалів' : 'Серіали До Перегляду'}
        </h2>

        <AddSeriesForm onAdd={handleAddSeries} />

        {currentList.length > 0 ? (
          <div className="series-grid">
            {currentList.map((s) => (
              <SeriesCard
                key={s.id}
                series={s}
                onUpdate={handleUpdateSeries}
                onDelete={handleDeleteSeries}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>
              {activeTab === 'archive' 
                ? 'Розслідування не розпочато. Додайте першу справу.' 
                : 'Список бажань порожній. Додайте серіали для майбутнього перегляду.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;

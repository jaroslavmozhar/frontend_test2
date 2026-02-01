import React, { useState, useEffect } from 'react';
import SeriesCard from '../components/SeriesCard';
import AddSeriesForm from '../components/AddSeriesForm';
import DetectiveStrings from '../components/DetectiveStrings';
import { mockSeries } from '../data/mock';
import seriesAPI from '../services/api';
import '../styles/crime-theme.css';

const STORAGE_KEY = 'crime_series_archive';
const WISHLIST_KEY = 'crime_series_wishlist';

// Helper function to check if localStorage is available (Safari private mode issue)
const isLocalStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

// Helper function to safely save to localStorage
const safeLocalStorageSave = (key, value) => {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.setItem(key, value);
      return true;
    }
  } catch (e) {
    console.error('❌ Failed to save to localStorage:', e);
  }
  return false;
};

// Helper function to safely load from localStorage
const safeLocalStorageLoad = (key) => {
  try {
    if (isLocalStorageAvailable()) {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
  } catch (e) {
    console.error('❌ Failed to load from localStorage:', e);
  }
  return null;
};

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
  const [isInitialized, setIsInitialized] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const [useOfflineMode, setUseOfflineMode] = useState(false);

  // Load data from API or LocalStorage on mount
  useEffect(() => {
    const loadData = async () => {
      console.log('🔄 Loading data...');
      
      // Check localStorage availability
      if (!isLocalStorageAvailable()) {
        setStorageWarning(true);
        console.warn('⚠️ LocalStorage not available');
      }

      // Try to load from API first
      const seriesResult = await seriesAPI.getAllSeries();
      const wishlistResult = await seriesAPI.getWishlist();

      if (seriesResult.success && wishlistResult.success) {
        // API is available - use API data
        console.log('✅ Loaded from API');
        const migratedSeries = seriesResult.data.map(item => ({
          ...item,
          notes: migrateNotes(item.notes),
          rating: item.rating !== undefined ? item.rating : 0
        }));
        const migratedWishlist = wishlistResult.data.map(item => ({
          ...item,
          notes: migrateNotes(item.notes),
          rating: item.rating !== undefined ? item.rating : 0
        }));

        setSeries(migratedSeries);
        setWishlist(migratedWishlist);
        
        // Save to localStorage as cache
        safeLocalStorageSave(STORAGE_KEY, JSON.stringify(migratedSeries));
        safeLocalStorageSave(WISHLIST_KEY, JSON.stringify(migratedWishlist));
        setUseOfflineMode(false);
      } else {
        // API not available - fallback to localStorage
        console.warn('⚠️ API not available, using LocalStorage');
        setUseOfflineMode(true);
        
        const storedSeries = safeLocalStorageLoad(STORAGE_KEY);
        const storedWishlist = safeLocalStorageLoad(WISHLIST_KEY);

        if (storedSeries) {
          const migrated = storedSeries.map(item => ({
            ...item,
            notes: migrateNotes(item.notes),
            rating: item.rating !== undefined ? item.rating : 0
          }));
          setSeries(migrated);
        } else {
          const migratedMock = mockSeries.map(item => ({
            ...item,
            notes: migrateNotes(item.notes)
          }));
          setSeries(migratedMock);
        }

        if (storedWishlist) {
          const migrated = storedWishlist.map(item => ({
            ...item,
            notes: migrateNotes(item.notes),
            rating: item.rating !== undefined ? item.rating : 0
          }));
          setWishlist(migrated);
        } else {
          setWishlist([]);
        }
      }

      setIsInitialized(true);
    };

    loadData();
  }, []);

  // Save to API and LocalStorage whenever data changes
  useEffect(() => {
    if (isInitialized && !useOfflineMode) {
      // Save to localStorage as cache
      safeLocalStorageSave(STORAGE_KEY, JSON.stringify(series));
    }
  }, [series, isInitialized, useOfflineMode]);

  useEffect(() => {
    if (isInitialized && !useOfflineMode) {
      safeLocalStorageSave(WISHLIST_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, isInitialized, useOfflineMode]);

  const handleAddSeries = async (newSeries) => {
    const seriesWithNotes = {
      ...newSeries,
      notes: [],
      rating: 0
    };
    
    if (activeTab === 'archive') {
      // Optimistic update
      const updated = [seriesWithNotes, ...series];
      setSeries(updated);
      
      // Save to API
      if (!useOfflineMode) {
        const result = await seriesAPI.createSeries(seriesWithNotes);
        if (!result.success) {
          console.warn('⚠️ Failed to save to API, saved locally only');
        }
      }
      
      // Save to localStorage as cache
      safeLocalStorageSave(STORAGE_KEY, JSON.stringify(updated));
    } else {
      const updated = [seriesWithNotes, ...wishlist];
      setWishlist(updated);
      
      if (!useOfflineMode) {
        const result = await seriesAPI.createWishlistItem(seriesWithNotes);
        if (!result.success) {
          console.warn('⚠️ Failed to save to API, saved locally only');
        }
      }
      
      safeLocalStorageSave(WISHLIST_KEY, JSON.stringify(updated));
    }
  };

  const handleUpdateSeries = async (updatedSeries) => {
    console.log('📝 Updating series:', updatedSeries.title);
    
    if (activeTab === 'archive') {
      const updated = series.map(s => 
        s.id === updatedSeries.id ? updatedSeries : s
      );
      setSeries(updated);
      
      // Save to API
      if (!useOfflineMode) {
        const result = await seriesAPI.updateSeries(updatedSeries.id, updatedSeries);
        if (!result.success) {
          console.warn('⚠️ Failed to update in API, saved locally only');
        }
      }
      
      safeLocalStorageSave(STORAGE_KEY, JSON.stringify(updated));
    } else {
      const updated = wishlist.map(s => 
        s.id === updatedSeries.id ? updatedSeries : s
      );
      setWishlist(updated);
      
      if (!useOfflineMode) {
        const result = await seriesAPI.updateWishlistItem(updatedSeries.id, updatedSeries);
        if (!result.success) {
          console.warn('⚠️ Failed to update in API, saved locally only');
        }
      }
      
      safeLocalStorageSave(WISHLIST_KEY, JSON.stringify(updated));
    }
  };

  const handleDeleteSeries = async (id) => {
    if (activeTab === 'archive') {
      const updated = series.filter(s => s.id !== id);
      setSeries(updated);
      
      // Delete from API
      if (!useOfflineMode) {
        const result = await seriesAPI.deleteSeries(id);
        if (!result.success) {
          console.warn('⚠️ Failed to delete from API, deleted locally only');
        }
      }
      
      safeLocalStorageSave(STORAGE_KEY, JSON.stringify(updated));
    } else {
      const updated = wishlist.filter(s => s.id !== id);
      setWishlist(updated);
      
      if (!useOfflineMode) {
        const result = await seriesAPI.deleteWishlistItem(id);
        if (!result.success) {
          console.warn('⚠️ Failed to delete from API, deleted locally only');
        }
      }
      
      safeLocalStorageSave(WISHLIST_KEY, JSON.stringify(updated));
    }
  };

  const currentList = activeTab === 'archive' ? series : wishlist;

  return (
    <div className="crime-scene-bg">
      {storageWarning && (
        <div className="storage-warning">
          <span className="warning-icon">⚠️</span>
          <p>
            <strong>УВАГА:</strong> LocalStorage недоступний (приватний режим браузера?). 
            Дані не будуть збережені після закриття сторінки.
          </p>
        </div>
      )}
      
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

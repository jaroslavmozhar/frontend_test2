import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack } from 'lucide-react';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  // Безкоштовні детективні треки з різних джерел
  const tracks = [
    {
      title: 'Noir Detective',
      artist: 'Mystery Theme',
      // Free music from Pixabay
      url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_2c7ba86c6a.mp3?filename=detective-115492.mp3'
    },
    {
      title: 'Crime Scene',
      artist: 'Dark Investigation',
      url: 'https://cdn.pixabay.com/download/audio/2022/05/13/audio_2f2c1a6d7a.mp3?filename=dark-mystery-trailer-126365.mp3'
    },
    {
      title: 'Night Watch',
      artist: 'Noir Atmosphere',
      url: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_c8dbf5116a.mp3?filename=mysterious-cinematic-trailer-135848.mp3'
    }
  ];

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      
      // Add error handler
      audioRef.current.onerror = (e) => {
        console.error('Audio error:', e);
        setError('Помилка завантаження треку');
        setIsPlaying(false);
      };
      
      // Add load handler
      audioRef.current.oncanplay = () => {
        setError(null);
        console.log('Audio ready to play');
      };
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('✅ Audio playing');
              setError(null);
            })
            .catch(e => {
              console.error('❌ Play failed:', e);
              setError('Не вдалося відтворити. Клікніть ще раз.');
              setIsPlaying(false);
            });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const nextTrack = () => {
    setIsPlaying(false);
    setTimeout(() => {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
      setIsPlaying(true);
    }, 100);
  };

  const prevTrack = () => {
    setIsPlaying(false);
    setTimeout(() => {
      setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
      setIsPlaying(true);
    }, 100);
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const selectTrack = (index) => {
    setIsPlaying(false);
    setTimeout(() => {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }, 100);
  };

  return (
    <div className={`audio-player ${isExpanded ? 'expanded' : ''}`}>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleTrackEnd}
        preload="auto"
      />

      {/* Compact Player */}
      <div 
        className="player-compact" 
        onClick={() => setIsExpanded(!isExpanded)}
        title="Музика розслідування"
      >
        <span className="player-icon">🎵</span>
      </div>

      {/* Expanded Player */}
      {isExpanded && (
        <div className="player-expanded" onClick={(e) => e.stopPropagation()}>
          <div className="player-header">
            <h3 className="player-heading">МУЗИКА</h3>
            <button 
              className="close-player-btn"
              onClick={() => setIsExpanded(false)}
              aria-label="Закрити"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="player-error">
              ⚠️ {error}
            </div>
          )}

          <div className="current-track-info">
            <div className="track-title">{currentTrack.title}</div>
            <div className="track-artist">{currentTrack.artist}</div>
          </div>

          {/* Controls */}
          <div className="player-controls">
            <button 
              className="control-btn" 
              onClick={prevTrack}
              aria-label="Попередній трек"
            >
              <SkipBack size={16} />
            </button>

            <button 
              className="control-btn play-btn" 
              onClick={togglePlay}
              aria-label={isPlaying ? 'Пауза' : 'Відтворити'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <button 
              className="control-btn" 
              onClick={nextTrack}
              aria-label="Наступний трек"
            >
              <SkipForward size={16} />
            </button>

            <button 
              className="control-btn" 
              onClick={toggleMute}
              aria-label={isMuted ? 'Увімкнути звук' : 'Вимкнути звук'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>

          {/* Volume Control */}
          <div className="volume-control">
            <Volume2 size={14} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="volume-slider"
              aria-label="Гучність"
            />
            <span className="volume-value">{Math.round(volume * 100)}%</span>
          </div>

          {/* Track List */}
          <div className="track-list">
            <div className="track-list-header">ТРЕКИ:</div>
            {tracks.map((track, index) => (
              <div
                key={index}
                className={`track-item ${index === currentTrackIndex ? 'active' : ''}`}
                onClick={() => selectTrack(index)}
              >
                <span className="track-number">{index + 1}.</span>
                <div className="track-info">
                  <div className="track-name">{track.title}</div>
                  <div className="track-subtitle">{track.artist}</div>
                </div>
                {index === currentTrackIndex && isPlaying && (
                  <span className="playing-indicator">♫</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;

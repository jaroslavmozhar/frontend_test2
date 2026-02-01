import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack } from 'lucide-react';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef(null);

  // Детективні треки (placeholder URLs - будуть працювати як приклад)
  // В реальному проєкті треба додати реальні файли в /public/audio/
  const tracks = [
    {
      title: 'Noir Investigation',
      artist: 'Crime Scene',
      // URL може бути замінений на реальний файл в /public/audio/track1.mp3
      url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_2c7ba86c6a.mp3'
    },
    {
      title: 'Detective Theme',
      artist: 'Mystery Hour',
      url: 'https://cdn.pixabay.com/audio/2022/05/13/audio_2f2c1a6d7a.mp3'
    },
    {
      title: 'Dark Evidence',
      artist: 'Crime Lab',
      url: 'https://cdn.pixabay.com/audio/2022/03/24/audio_c8dbf5116a.mp3'
    }
  ];

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
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
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const selectTrack = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  return (
    <div className={`audio-player ${isExpanded ? 'expanded' : ''}`}>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleTrackEnd}
        loop={false}
      />

      {/* Compact Player */}
      <div className="player-compact" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="player-icon">🎵</span>
        <span className="player-title">
          {isPlaying ? '♫ ' : ''}Детективна музика
        </span>
      </div>

      {/* Expanded Player */}
      {isExpanded && (
        <div className="player-expanded" onClick={(e) => e.stopPropagation()}>
          <div className="player-header">
            <h3 className="player-heading">МУЗИКА РОЗСЛІДУВАННЯ</h3>
            <button 
              className="close-player-btn"
              onClick={() => setIsExpanded(false)}
              aria-label="Закрити"
            >
              ✕
            </button>
          </div>

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
              <SkipBack size={20} />
            </button>

            <button 
              className="control-btn play-btn" 
              onClick={togglePlay}
              aria-label={isPlaying ? 'Пауза' : 'Відтворити'}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <button 
              className="control-btn" 
              onClick={nextTrack}
              aria-label="Наступний трек"
            >
              <SkipForward size={20} />
            </button>

            <button 
              className="control-btn" 
              onClick={toggleMute}
              aria-label={isMuted ? 'Увімкнути звук' : 'Вимкнути звук'}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>

          {/* Volume Control */}
          <div className="volume-control">
            <Volume2 size={16} />
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

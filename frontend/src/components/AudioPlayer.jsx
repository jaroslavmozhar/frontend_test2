import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack } from 'lucide-react';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  const tracks = [
    {
      title: 'Noir Detective',
      artist: 'Mystery Theme',
      frequency: 220, // A3 - low mysterious tone
      type: 'sine'
    },
    {
      title: 'Crime Scene',
      artist: 'Dark Investigation',
      frequency: 110, // A2 - deep dark tone
      type: 'sawtooth'
    },
    {
      title: 'Night Watch',
      artist: 'Noir Atmosphere',
      frequency: 165, // E3 - atmospheric tone
      type: 'triangle'
    }
  ];

  const currentTrack = tracks[currentTrackIndex];

  // Initialize Web Audio API
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return () => {
      stopAudio();
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const stopAudio = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {
        // Already stopped
      }
      oscillatorRef.current = null;
    }
  };

  const playAudio = () => {
    stopAudio();

    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    // Resume audio context if suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    // Create oscillator for tone
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = currentTrack.type;
    oscillator.frequency.setValueAtTime(currentTrack.frequency, audioContext.currentTime);

    // Create subtle vibrato effect
    const vibrato = audioContext.createOscillator();
    const vibratoGain = audioContext.createGain();
    vibrato.frequency.value = 5;
    vibratoGain.gain.value = 5;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(oscillator.frequency);
    vibrato.start();

    gainNode.gain.value = isMuted ? 0 : volume;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;

    console.log('✅ Audio playing - generated tone');
  };

  useEffect(() => {
    if (isPlaying) {
      playAudio();
    } else {
      stopAudio();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
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

  const selectTrack = (index) => {
    setIsPlaying(false);
    setTimeout(() => {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }, 100);
  };

  return (
    <div className={`audio-player ${isExpanded ? 'expanded' : ''}`}>
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

          <div className="player-note">
            🎼 Атмосферні тони для настрою
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;

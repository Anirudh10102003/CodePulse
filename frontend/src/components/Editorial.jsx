import { useState, useRef, useEffect } from 'react';
import { Pause, Play, Volume2 } from 'lucide-react';

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) { videoRef.current.pause(); } else { videoRef.current.play(); }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    const handleTimeUpdate = () => { if (video) setCurrentTime(video.currentTime); };
    if (video) { video.addEventListener('timeupdate', handleTimeUpdate); return () => video.removeEventListener('timeupdate', handleTimeUpdate); }
  }, []);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--accent-green)', letterSpacing: '0.1em', marginBottom: '16px' }}>Understand the Question+Solution</div>

      <div
        style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#000', border: '1px solid var(--border-subtle)', boxShadow: isPlaying ? 'var(--glow-green)' : 'none', transition: 'box-shadow 0.3s' }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <video ref={videoRef} src={secureUrl} poster={thumbnailUrl} onClick={togglePlayPause}
          style={{ width: '100%', aspectRatio: '16/9', display: 'block', cursor: 'pointer' }} />

        {/* Big play button overlay when paused */}
        {!isPlaying && (
          <div onClick={togglePlayPause} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.3)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,255,135,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--glow-green)', transform: 'scale(1)', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <Play size={24} color="#000" style={{ marginLeft: '3px' }} />
            </div>
          </div>
        )}

        {/* Controls */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)', padding: '20px 16px 12px', opacity: isHovering || !isPlaying ? 1 : 0, transition: 'opacity 0.2s' }}>
          {/* Progress bar */}
          <div style={{ marginBottom: '10px', position: 'relative', height: '3px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', cursor: 'pointer' }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              if (videoRef.current) videoRef.current.currentTime = ratio * duration;
            }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent-green)', borderRadius: '2px', position: 'relative' }}>
              <div style={{ position: 'absolute', right: '-5px', top: '-4px', width: '11px', height: '11px', borderRadius: '50%', background: 'var(--accent-green)', boxShadow: '0 0 6px rgba(0,255,135,0.6)' }} />
            </div>
          </div>

          {/* Controls row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={togglePlayPause}
              style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-green)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              {isPlaying ? <Pause size={14} color="#000" /> : <Play size={14} color="#000" style={{ marginLeft: '1px' }} />}
            </button>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <Volume2 size={14} color="rgba(255,255,255,0.5)" style={{ marginLeft: 'auto' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editorial;

import { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, Captions, ChevronRight, ChevronLeft, MoreVertical } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  subtitleSrc?: string;
  className?: string;
  muted?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
  isActiveCard?: boolean;
  isPlayingProp?: boolean;
}

const parseVideoUrl = (url: string) => {
  if (!url) return { url: "", type: "native", id: "" };
  
  // Google Drive
  const driveRegex = /drive\.google\.com\/file\/d\/([^/]+)/;
  const driveMatch = url.match(driveRegex);
  if (driveMatch && driveMatch[1]) {
    return { url: `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`, type: "native", id: driveMatch[1] };
  }

  // YouTube
  const ytRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?/\s]{11})/;
  const ytMatch = url.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    return { url: `https://www.youtube.com/watch?v=${ytMatch[1]}`, type: "youtube", id: ytMatch[1] };
  }

  return { url, type: "native", id: "" };
};

const VideoPlayer = ({ src, subtitleSrc, className = "", muted = true, loop = true, autoPlay = false, onPlayStateChange, isActiveCard = true, isPlayingProp = undefined }: VideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReactPlayer>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const videoInfo = parseVideoUrl(src);
  const isYouTube = videoInfo.type === "youtube";

  const [isMuted, setIsMuted] = useState(muted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'main' | 'settings' | 'quality' | 'speed'>('main');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoQuality, setVideoQuality] = useState("Auto");
  const [isCaptionsOn, setIsCaptionsOn] = useState(false);
  
  const [localIsPlaying, setLocalIsPlaying] = useState(autoPlay);
  const isActuallyPlaying = isPlayingProp !== undefined ? isPlayingProp : localIsPlaying;

  // Strictly controlled playback based on isPlayingProp
  useEffect(() => {
    if (isPlayingProp === undefined) return;
    
    if (isPlayingProp) {
      if (videoInfo.type === "native" && videoRef.current) {
        videoRef.current.play().catch(console.error);
      } else if (videoInfo.type === "youtube" && iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage(JSON.stringify({
          event: 'command',
          func: 'playVideo',
          args: []
        }), '*');
      }
    } else {
      if (videoInfo.type === "native" && videoRef.current) {
        videoRef.current.pause();
      } else if (videoInfo.type === "youtube" && iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage(JSON.stringify({
          event: 'command',
          func: 'pauseVideo',
          args: []
        }), '*');
      }
    }
  }, [isPlayingProp, videoInfo.type]);

  // YouTube API Message Listener for robust play state detection
  useEffect(() => {
    if (!isYouTube || !iframeRef.current) return;
    const iframe = iframeRef.current;
    
    const listenToYouTube = () => {
      iframe.contentWindow?.postMessage(JSON.stringify({ event: 'listening' }), 'https://www.youtube.com');
    };
    
    listenToYouTube();
    iframe.addEventListener('load', listenToYouTube);

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com") return;
      try {
        const data = JSON.parse(event.data);
        if (data.event === "onStateChange" && event.source === iframe.contentWindow) {
          if (data.info === 1) { // Playing
            setLocalIsPlaying(true);
            onPlayStateChange?.(true);
          } else if (data.info === 2 || data.info === 0) { // Paused or Ended
            setLocalIsPlaying(false);
            onPlayStateChange?.(false);
          }
        }
      } catch (e) {}
    };

    window.addEventListener("message", handleMessage);
    return () => {
      iframe.removeEventListener('load', listenToYouTube);
      window.removeEventListener("message", handleMessage);
    };
  }, [isYouTube, onPlayStateChange]);

  // Fallback hack to detect when a native YouTube iframe is clicked
  useEffect(() => {
    const handleBlur = () => {
      setTimeout(() => {
        if (document.activeElement?.tagName === 'IFRAME' && containerRef.current?.contains(document.activeElement)) {
          onPlayStateChange?.(true);
        }
      }, 100);
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [onPlayStateChange]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (videoInfo.type === "native" && videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, videoInfo.type]);

  // Auto-mute when scrolled out of view
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && !isMuted) {
          setIsMuted(true);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, [isMuted]);

  // Sync mute state to YouTube iframe
  useEffect(() => {
    if (isYouTube && iframeRef.current) {
      const command = isMuted ? 'mute' : 'unMute';
      iframeRef.current.contentWindow?.postMessage(JSON.stringify({
        event: 'command',
        func: command,
        args: []
      }), '*');
    }
  }, [isMuted, isYouTube]);

  const togglePlay = () => {
    const nextState = !isActuallyPlaying;
    if (isPlayingProp === undefined) {
      setLocalIsPlaying(nextState);
    }
    
    if (videoInfo.type === "native" && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(console.error);
        onPlayStateChange?.(true);
      } else {
        videoRef.current.pause();
        onPlayStateChange?.(false);
      }
    } else if (videoInfo.type === "youtube" && iframeRef.current) {
      const command = nextState ? 'playVideo' : 'pauseVideo';
      iframeRef.current.contentWindow?.postMessage(JSON.stringify({
        event: 'command',
        func: command,
        args: []
      }), '*');
      onPlayStateChange?.(nextState);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleQualityChange = (quality: string) => {
    setVideoQuality(quality);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoInfo.type === "native" && videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleCaptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    
    const track = videoRef.current.textTracks[0];
    if (!track) return;
    
    const newState = !isCaptionsOn;
    track.mode = newState ? 'showing' : 'hidden';
    setIsCaptionsOn(newState);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoInfo.type === "native" && videoRef.current) {
      videoRef.current.currentTime = time;
    } else if (videoInfo.type === "youtube" && iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(JSON.stringify({
        event: 'command',
        func: 'seekTo',
        args: [time, true]
      }), '*');
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative group ${className} overflow-hidden bg-black flex items-center justify-center rounded-xl ${isActiveCard ? 'pointer-events-auto' : 'pointer-events-none'}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => { setShowControls(false); setShowSettingsMenu(false); setActiveMenu('main'); }}
      onClick={() => {
        togglePlay();
        setShowSettingsMenu(false);
        setActiveMenu('main');
      }}
    >
      <div className={`absolute inset-0 z-0 flex items-center justify-center ${isActiveCard ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {isYouTube ? (
          <iframe 
            ref={iframeRef}
            key={videoInfo.id}
            src={`https://www.youtube.com/embed/${videoInfo.id}?rel=0&playsinline=1&enablejsapi=1${autoPlay ? '&autoplay=1' : ''}${muted ? '&mute=1' : ''}`}
            className={`w-full h-full border-0 z-10 ${isActiveCard ? 'pointer-events-auto' : 'pointer-events-none'}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube Video"
          />
        ) : (
          <video
            ref={videoRef}
            src={videoInfo.url}
            className="w-full h-full object-cover"
            muted={isMuted}
            playsInline
            loop={loop}
            preload="auto"
            autoPlay={autoPlay}
            onPlay={() => { setLocalIsPlaying(true); onPlayStateChange?.(true); }}
            onPause={() => { setLocalIsPlaying(false); onPlayStateChange?.(false); }}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onError={(e) => console.error('Native Video Error:', e)}
          >
            {subtitleSrc && (
              <track 
                kind="subtitles" 
                srcLang="en" 
                label="English" 
                src={subtitleSrc} 
                default={isCaptionsOn} 
              />
            )}
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      
      {!isActuallyPlaying && !isYouTube && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none group-hover:scale-105 transition-transform duration-700">
          <div 
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-md border border-primary/60 text-white flex items-center justify-center shadow-[0_0_40px_rgba(var(--primary),0.5)] transform scale-100 hover:scale-110 transition-all duration-300 hover:border-primary hover:bg-white/20 ${isActiveCard ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'}`}
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          >
            <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 sm:ml-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" fill="currentColor" />
          </div>
        </div>
      )}

          {/* Floating Control Bar - Hidden for YouTube */}
          {!isYouTube && (
          <div 
            className={`absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 transition-all duration-300 ease-in-out z-30 ${
              showControls || !isActuallyPlaying ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2 sm:p-3 shadow-2xl flex items-center gap-2 sm:gap-4 ${isActiveCard ? 'pointer-events-auto' : 'pointer-events-none'}`}>
              {/* Play/Pause Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                className="text-white hover:text-primary transition-colors focus:outline-none shrink-0"
              >
                {isActuallyPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" />}
              </button>

              {/* Time Display */}
              <div className="text-white/90 text-xs sm:text-sm font-medium tabular-nums tracking-wide shrink-0">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              {/* Seek Bar */}
              <div className="flex-1 flex items-center group/slider relative mx-2">
                <input 
                  type="range" 
                  min="0" 
                  max={duration || 100} 
                  value={currentTime} 
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-125 transition-all focus:outline-none z-10"
                />
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-primary rounded-full pointer-events-none"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>

              {/* Secondary Controls */}
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                {subtitleSrc && videoInfo.type === "native" && (
                  <button 
                    onClick={toggleCaptions} 
                    className={`transition-colors hidden sm:block focus:outline-none ${isCaptionsOn ? 'text-primary' : 'text-white/80 hover:text-white'}`}
                    title="Subtitles/CC"
                  >
                    <Captions className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
                
                {/* Options Menu */}
                <div className="relative">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowSettingsMenu(!showSettingsMenu); setActiveMenu('main'); }}
                    className={`text-white/80 hover:text-white transition-colors hidden sm:block focus:outline-none ${showSettingsMenu ? 'text-primary' : ''}`}
                  >
                    <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  
                  {/* Settings Popup Menu */}
                  {showSettingsMenu && (
                    <div 
                      className="absolute bottom-full right-0 mb-4 w-56 max-h-64 overflow-y-auto bg-indigo-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 text-sm animate-in fade-in zoom-in-95 duration-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" 
                      onClick={e => e.stopPropagation()}
                    >
                      {activeMenu === 'main' && (
                        <>
                          <div className="px-4 py-3 border-b border-white/10 font-bold text-white bg-white/5 sticky top-0 z-10 rounded-t-2xl">Options</div>
                          <div className="py-2">
                            <button 
                              onClick={() => setActiveMenu('settings')}
                              className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center justify-between text-white/90"
                            >
                              <span className="flex items-center gap-2"><Settings className="w-4 h-4" /> Settings</span>
                              <ChevronRight className="w-4 h-4 text-white/50" />
                            </button>
                            <button 
                              onClick={(e) => { toggleFullscreen(e); setShowSettingsMenu(false); }}
                              className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center justify-between text-white/90"
                            >
                              <span className="flex items-center gap-2">
                                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />} 
                                Fullscreen
                              </span>
                            </button>
                          </div>
                        </>
                      )}

                      {activeMenu === 'settings' && (
                        <>
                          <div 
                            className="px-4 py-3 border-b border-white/10 font-bold text-white bg-white/5 sticky top-0 z-10 rounded-t-2xl flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => setActiveMenu('main')}
                          >
                            <ChevronLeft className="w-4 h-4 text-white/70" /> Settings
                          </div>
                          <div className="py-2">
                            {videoInfo.type === "native" && (
                              <button 
                                onClick={() => setActiveMenu('quality')}
                                className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center justify-between text-white/90"
                              >
                                <span>Quality</span>
                                <span className="text-white/50 flex items-center gap-1 text-xs">
                                  {videoQuality} <ChevronRight className="w-4 h-4" />
                                </span>
                              </button>
                            )}
                            <button 
                              onClick={() => setActiveMenu('speed')}
                              className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center justify-between text-white/90"
                            >
                              <span>Playback Speed</span>
                              <span className="text-white/50 flex items-center gap-1 text-xs">
                                {playbackSpeed === 1 ? 'Normal' : `${playbackSpeed}x`} <ChevronRight className="w-4 h-4" />
                              </span>
                            </button>
                          </div>
                        </>
                      )}

                      {videoInfo.type === "native" && activeMenu === 'quality' && (
                        <>
                          <div 
                            className="px-4 py-3 border-b border-white/10 font-bold text-white bg-white/5 sticky top-0 z-10 rounded-t-2xl flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => setActiveMenu('settings')}
                          >
                            <ChevronLeft className="w-4 h-4 text-white/70" /> Quality
                          </div>
                          <div className="py-2">
                            {["Auto", "720p", "1080p (Full HD)", "2K (QHD)", "4K (Ultra HD)"].map(q => (
                              <button 
                                key={q} 
                                onClick={() => { handleQualityChange(q); setActiveMenu('main'); setShowSettingsMenu(false); }}
                                className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center justify-between ${videoQuality === q ? 'text-primary bg-primary/10' : 'text-white/80'}`}
                              >
                                <span className="truncate pr-2">{q}</span> {videoQuality === q && <span className="w-2 h-2 rounded-full bg-primary inline-block shrink-0"></span>}
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                      {activeMenu === 'speed' && (
                        <>
                          <div 
                            className="px-4 py-3 border-b border-white/10 font-bold text-white bg-white/5 sticky top-0 z-10 rounded-t-2xl flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => setActiveMenu('settings')}
                          >
                            <ChevronLeft className="w-4 h-4 text-white/70" /> Playback Speed
                          </div>
                          <div className="py-2">
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map(s => (
                              <button 
                                key={s} 
                                onClick={() => { handleSpeedChange(s); setActiveMenu('main'); setShowSettingsMenu(false); }}
                                className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center justify-between ${playbackSpeed === s ? 'text-primary bg-primary/10' : 'text-white/80'}`}
                              >
                                {s === 1 ? 'Normal' : `${s}x`} {playbackSpeed === s && <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <button onClick={toggleMute} className="text-white hover:text-primary transition-colors focus:outline-none">
                  {isMuted ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />}
                </button>
              </div>
            </div>
          </div>
          )}
    </div>
  );
};

import React from 'react';
class VideoPlayerErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full bg-red-900/50 flex items-center justify-center text-white p-4 rounded-xl text-center">
          <div>
            <p className="font-bold text-lg mb-2">Video Player Crashed</p>
            <p className="text-sm font-mono text-white/70 break-all">{this.state.error?.message}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function VideoPlayerWrapper(props: VideoPlayerProps) {
  return (
    <VideoPlayerErrorBoundary>
      <VideoPlayer {...props} />
    </VideoPlayerErrorBoundary>
  );
}

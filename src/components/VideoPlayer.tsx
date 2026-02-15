import { useRef, useState } from "react";
import { Play } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

const VideoPlayer = ({ src, className = "", autoPlay = false, muted = true, loop = true }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  if (!src) return null;

  return (
    <div className={`relative group cursor-pointer ${className}`} onClick={handlePlay}>
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover rounded-lg"
        playsInline
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg transition-opacity">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-7 h-7 text-primary-foreground ml-1" fill="currentColor" />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;

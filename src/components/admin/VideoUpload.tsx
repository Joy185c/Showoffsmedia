import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import ReactPlayer from "react-player";

interface VideoUploadProps {
  value: string;
  onChange: (url: string) => void;
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

const VideoUpload = ({ value, onChange }: VideoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("Video must be under 50MB");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage.from("videos").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("videos").getPublicUrl(path);
    onChange(urlData.publicUrl);
    setUploading(false);
    toast.success("Video uploaded");
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    onChange(inputUrl.trim());
    setInputUrl("");
  };

  const handleRemove = () => {
    onChange("");
  };

  const videoInfo = parseVideoUrl(value);

  useEffect(() => {
    const handleGlobalPause = (e: CustomEvent) => {
      if (e.detail.id !== value) {
        if (videoInfo.type === "youtube" && iframeRef.current) {
          iframeRef.current.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo' }), '*');
        }
      }
    };
    window.addEventListener('stopOtherVideos', handleGlobalPause as EventListener);
    return () => window.removeEventListener('stopOtherVideos', handleGlobalPause as EventListener);
  }, [value, videoInfo.type]);

  const handlePlayStart = () => {
    window.dispatchEvent(new CustomEvent('stopOtherVideos', { detail: { id: value } }));
  };

  useEffect(() => {
    if (videoInfo.type !== "youtube" || !iframeRef.current) return;
    const iframe = iframeRef.current;
    
    const listenToYouTube = () => {
      iframe.contentWindow?.postMessage(JSON.stringify({ event: 'listening' }), 'https://www.youtube.com');
    };
    
    iframe.addEventListener('load', listenToYouTube);

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com") return;
      try {
        const data = JSON.parse(event.data);
        if (data.event === "onStateChange" && event.source === iframe.contentWindow) {
          if (data.info === 1) { // Playing
            handlePlayStart();
          }
        }
      } catch (e) {}
    };

    window.addEventListener("message", handleMessage);
    return () => {
      iframe.removeEventListener('load', listenToYouTube);
      window.removeEventListener("message", handleMessage);
    };
  }, [value, videoInfo.type]);

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative group">
          <div className="w-full h-32 bg-black/40 rounded border border-border overflow-hidden relative flex items-center justify-center group-hover:border-primary/50 transition-colors">
             {videoInfo.type === "youtube" ? (
               <iframe 
                 ref={iframeRef}
                 src={`https://www.youtube.com/embed/${videoInfo.id}?rel=0&enablejsapi=1`}
                 className="w-full h-full border-0 pointer-events-auto z-10"
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                 allowFullScreen
                 title="YouTube Video"
               />
             ) : (() => {
               const Player = ReactPlayer as any;
               return (
                 <Player 
                   url={videoInfo.url} 
                   width="100%" 
                   height="100%" 
                   controls={true}
                   playing={false}
                   onPlay={handlePlayStart}
                   config={{ file: { forceVideo: true } }}
                 />
               );
             })()}
          </div>
          <div className="text-xs text-muted-foreground mt-1 truncate pr-8" title={value}>{value}</div>
          <Button size="icon" variant="destructive" className="absolute top-1 right-1 w-6 h-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleRemove}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <form onSubmit={handleUrlSubmit} className="flex gap-2">
            <Input 
              placeholder="Paste YouTube, Google Drive, or Video URL" 
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="text-xs h-9"
            />
            <Button type="submit" size="sm" variant="secondary" className="h-9 whitespace-nowrap">
              <LinkIcon className="w-3 h-3 mr-1" /> Add URL
            </Button>
          </form>
          
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink-0 mx-2 text-muted-foreground text-[10px] uppercase font-bold tracking-wider">or</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={handleUpload} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="w-full h-9"
          >
            {uploading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Upload className="w-3 h-3 mr-1" />}
            {uploading ? "Uploading..." : "Upload Video File"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;

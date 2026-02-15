import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface VideoUploadProps {
  value: string;
  onChange: (url: string) => void;
}

const VideoUpload = ({ value, onChange }: VideoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative">
          <video src={value} className="w-full max-h-32 object-cover rounded border border-border" muted playsInline preload="metadata" />
          <Button size="icon" variant="destructive" className="absolute top-1 right-1 w-6 h-6" onClick={handleRemove}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <div>
          <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={handleUpload} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="w-full"
          >
            {uploading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Upload className="w-3 h-3 mr-1" />}
            {uploading ? "Uploading..." : "Upload Video"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { toast } from "sonner";
import VideoUpload from "@/components/admin/VideoUpload";

const SiteContentPage = () => {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    const { data } = await supabase.from("site_content").select("*");
    const map: Record<string, string> = {};
    data?.forEach((item) => { map[item.key] = item.value; });
    setContent(map);
    setLoading(false);
  };

  useEffect(() => { fetchContent(); }, []);

  const save = async (key: string) => {
    const { error } = await supabase
      .from("site_content")
      .update({ value: content[key], updated_at: new Date().toISOString() })
      .eq("key", key);
    if (error) toast.error(error.message);
    else toast.success(`"${key}" updated`);
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  const fields = [
    { key: "hero_title_1", label: "Hero Title Line 1" },
    { key: "hero_title_2", label: "Hero Title Line 2 (gradient)" },
    { key: "hero_subtitle", label: "Hero Subtitle" },
    { key: "hero_social_proof", label: "Social Proof Text" },
    { key: "hero_social_sub", label: "Social Proof Subtext" },
    { key: "stats_heading", label: "Stats Section Heading" },
    { key: "stats_heading_highlight", label: "Stats Heading Highlight" },
    { key: "stats_subheading", label: "Stats Subheading" },
    { key: "book_call_url", label: "Book A Call URL" },
    { key: "footer_text", label: "Footer Text" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">Site Content</h1>

      {/* Hero Video Upload */}
      <div className="glass-card p-4 mb-6">
        <Label className="text-sm font-semibold text-foreground mb-2 block">Hero Video</Label>
        <p className="text-xs text-muted-foreground mb-3">Upload a video to replace the hero image. Remove to show the default image.</p>
        <div className="max-w-sm">
          <VideoUpload
            value={content.hero_video_url ?? ""}
            onChange={(url) => setContent((p) => ({ ...p, hero_video_url: url }))}
          />
        </div>
        <Button size="sm" className="mt-3" onClick={() => save("hero_video_url")}>
          <Save className="w-3 h-3 mr-1" /> Save Hero Video
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((f) => (
          <div key={f.key} className="glass-card p-4 flex flex-col md:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <Label className="text-xs text-muted-foreground">{f.label}</Label>
              <Input
                value={content[f.key] ?? ""}
                onChange={(e) => setContent((p) => ({ ...p, [f.key]: e.target.value }))}
              />
            </div>
            <Button size="sm" onClick={() => save(f.key)}>
              <Save className="w-3 h-3 mr-1" /> Save
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiteContentPage;

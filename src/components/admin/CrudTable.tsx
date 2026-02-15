import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";
import { toast } from "sonner";
import VideoUpload from "./VideoUpload";

export interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "boolean" | "select" | "video";
  options?: { label: string; value: string }[];
  required?: boolean;
}

interface CrudTableProps {
  tableName: string;
  fields: FieldConfig[];
  data: any[];
  onRefresh: () => void;
  title: string;
}

const CrudTable = ({ tableName, fields, data, onRefresh, title }: CrudTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, any>>({});
  const [adding, setAdding] = useState(false);
  const [newData, setNewData] = useState<Record<string, any>>({});

  const startEdit = (row: any) => {
    setEditingId(row.id);
    setEditData({ ...row });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    const updates: Record<string, any> = {};
    fields.forEach((f) => {
      if (editData[f.key] !== undefined) updates[f.key] = editData[f.key];
    });

    const { error } = await (supabase.from(tableName as any) as any).update(updates).eq("id", editingId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Updated successfully");
      cancelEdit();
      onRefresh();
    }
  };

  const deleteRow = async (id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    const { error } = await (supabase.from(tableName as any) as any).delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Deleted successfully");
      onRefresh();
    }
  };

  const addRow = async () => {
    const { error } = await (supabase.from(tableName as any) as any).insert(newData);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Added successfully");
      setAdding(false);
      setNewData({});
      onRefresh();
    }
  };

  const renderInput = (field: FieldConfig, value: any, onChange: (val: any) => void) => {
    if (field.type === "video") {
      return <VideoUpload value={value ?? ""} onChange={onChange} />;
    }
    if (field.type === "textarea") {
      return (
        <textarea
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
        />
      );
    }
    if (field.type === "boolean") {
      return (
        <select
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={value ? "true" : "false"}
          onChange={(e) => onChange(e.target.value === "true")}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    }
    if (field.type === "select" && field.options) {
      return (
        <select
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      );
    }
    return (
      <Input
        type={field.type === "number" ? "number" : "text"}
        value={value ?? ""}
        onChange={(e) => onChange(field.type === "number" ? Number(e.target.value) : e.target.value)}
      />
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">{title}</h1>
        <Button onClick={() => { setAdding(true); setNewData({}); }} size="sm">
          <Plus className="w-4 h-4 mr-1" /> Add New
        </Button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="glass-card p-4 mb-4 space-y-3">
          <h3 className="font-semibold text-foreground text-sm">Add New Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.key}>
                <Label className="text-xs">{f.label}</Label>
                {renderInput(f, newData[f.key], (v) => setNewData((p) => ({ ...p, [f.key]: v })))}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={addRow}><Save className="w-3 h-3 mr-1" /> Save</Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)}><X className="w-3 h-3 mr-1" /> Cancel</Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {fields.map((f) => (
                  <th key={f.key} className="text-left p-3 text-muted-foreground font-medium">{f.label}</th>
                ))}
                <th className="p-3 text-muted-foreground font-medium w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b border-border/50 hover:bg-secondary/30">
                  {fields.map((f) => (
                    <td key={f.key} className="p-3">
                      {editingId === row.id ? (
                        renderInput(f, editData[f.key], (v) => setEditData((p) => ({ ...p, [f.key]: v })))
                      ) : (
                        <span className="text-foreground/90">
                          {f.type === "boolean" ? (row[f.key] ? "✅" : "❌") : String(row[f.key] ?? "")}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="p-3">
                    {editingId === row.id ? (
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={saveEdit}><Save className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={cancelEdit}><X className="w-4 h-4" /></Button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => startEdit(row)}><Pencil className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteRow(row.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan={fields.length + 1} className="p-6 text-center text-muted-foreground">No data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CrudTable;

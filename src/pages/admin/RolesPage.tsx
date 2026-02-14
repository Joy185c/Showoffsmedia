import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface RoleRow {
  id: string;
  user_id: string;
  role: "admin" | "editor";
  email?: string;
}

const RolesPage = () => {
  const { role: currentRole } = useAuth();
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "editor">("editor");

  const fetchRoles = async () => {
    const { data } = await supabase
      .from("user_roles")
      .select("id, user_id, role");

    if (data) {
      // Fetch emails from profiles
      const userIds = data.map((r) => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, email");

      const emailMap = new Map(profiles?.map((p) => [p.user_id, p.email]) ?? []);
      setRoles(data.map((r) => ({ ...r, email: emailMap.get(r.user_id) ?? "Unknown" })));
    }
  };

  useEffect(() => { fetchRoles(); }, []);

  const addRole = async () => {
    if (!newEmail) return;
    // Find user by email in profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("email", newEmail)
      .maybeSingle();

    if (!profile) {
      toast.error("User not found. They must sign up first.");
      return;
    }

    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: profile.user_id, role: newRole });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Role assigned");
      setNewEmail("");
      fetchRoles();
    }
  };

  const removeRole = async (id: string) => {
    if (!confirm("Remove this role?")) return;
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Role removed"); fetchRoles(); }
  };

  if (currentRole !== "admin") {
    return <p className="text-muted-foreground">Only admins can manage roles.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">User Roles</h1>

      <div className="glass-card p-4 mb-6">
        <h3 className="font-semibold text-foreground text-sm mb-3">Assign Role</h3>
        <div className="flex gap-3 items-end flex-wrap">
          <div>
            <Label className="text-xs">User Email</Label>
            <Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="user@email.com" />
          </div>
          <div>
            <Label className="text-xs">Role</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as "admin" | "editor")}
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
            </select>
          </div>
          <Button size="sm" onClick={addRole}><Plus className="w-3 h-3 mr-1" /> Assign</Button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 text-muted-foreground font-medium">Email</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Role</th>
              <th className="p-3 text-muted-foreground font-medium w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.id} className="border-b border-border/50">
                <td className="p-3 text-foreground">{r.email}</td>
                <td className="p-3"><span className="capitalize text-primary font-semibold">{r.role}</span></td>
                <td className="p-3">
                  <Button size="icon" variant="ghost" onClick={() => removeRole(r.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolesPage;

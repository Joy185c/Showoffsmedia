import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, user, session } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        toast.success("Account created! Now bootstrap yourself as admin.");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        navigate("/admin");
      }
    }
    setLoading(false);
  };

  const bootstrapAdmin = async () => {
    if (!session) {
      toast.error("Sign in first");
      return;
    }
    try {
      const { data, error } = await supabase.functions.invoke("bootstrap-admin");
      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success("You are now an admin! Redirecting...");
        setTimeout(() => window.location.href = "/admin", 1500);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to bootstrap admin");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md">
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">Admin {isSignUp ? "Sign Up" : "Login"}</h1>
        <p className="text-muted-foreground text-sm mb-6">
          {isSignUp ? "Create an account, then bootstrap as admin" : "Sign in to manage your website"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>

        {user && (
          <div className="mt-4">
            <Button variant="outline" className="w-full" onClick={bootstrapAdmin}>
              🔐 Bootstrap as First Admin
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">Only works if no admin exists yet</p>
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-primary hover:underline">
            {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
          </button>
          <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Website</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

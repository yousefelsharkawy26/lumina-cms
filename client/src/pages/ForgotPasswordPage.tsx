import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Store, ArrowRight, CheckCircle2 } from "lucide-react";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("/api/users/forgot-password", { email });
      setSuccess(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to send reset link.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-8 sm:p-12 relative animate-in fade-in duration-700">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 bg-primary/5">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom-4 duration-500 relative z-10 bg-background/60 backdrop-blur-3xl p-8 sm:p-12 rounded-3xl shadow-2xl border border-border/50">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
            <Store className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Forgot Password</h2>
          <p className="text-muted-foreground text-sm">
            Enter your email and we'll send you a secure link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="space-y-6 animate-in zoom-in-95">
            <div className="p-6 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20 text-center flex flex-col items-center gap-3">
              <CheckCircle2 className="w-12 h-12 mb-2" />
              <p className="font-semibold text-lg">Check your inbox</p>
              <p className="text-sm">We've sent a password reset link to <strong>{email}</strong>.</p>
            </div>
            <Link to="/login" className="block">
              <Button className="w-full h-12 text-base font-bold rounded-xl shadow-lg">
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm font-medium bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-center animate-in slide-in-from-top-1">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground/80">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary h-12 rounded-xl"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98] group"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Send Reset Link <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground pt-4">
              Remember your password?{" "}
              <Link to="/login" className="font-bold text-primary hover:underline hover:text-primary/80 transition-colors">
                Back to Login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    setError("");

    try {
      await axiosInstance.post(`/api/users/reset-password/${token}`, {
        password,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 4000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Failed to reset password. The link may have expired.",
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-8 sm:p-12 relative animate-in fade-in duration-700">
      <div className="absolute inset-0 z-0 bg-primary/5">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom-4 duration-500 relative z-10 bg-background/60 backdrop-blur-3xl p-8 sm:p-12 rounded-3xl shadow-2xl border border-border/50">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Set New Password
          </h2>
          <p className="text-muted-foreground text-sm">
            Enter a strong password to secure your account.
          </p>
        </div>

        {success ? (
          <div className="space-y-6 animate-in zoom-in-95">
            <div className="p-6 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20 text-center flex flex-col items-center gap-3">
              <CheckCircle2 className="w-12 h-12 mb-2" />
              <p className="font-semibold text-lg">Password Updated!</p>
              <p className="text-sm">
                You will be redirected to the login page shortly.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm font-medium bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-center animate-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-foreground/80"
                >
                  New Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  required
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary h-12 rounded-xl"
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold text-foreground/80"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  required
                  value={confirmPassword}
                  disabled={loading}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary h-12 rounded-xl"
                  minLength={6}
                />
              </div>
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
                  Update Password{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground pt-4">
              <Link
                to="/login"
                className="font-bold text-primary hover:underline hover:text-primary/80 transition-colors"
              >
                Back to Login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

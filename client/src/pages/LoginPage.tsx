import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Store, ArrowRight } from "lucide-react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/users/google", {
        idToken: credentialResponse.credential,
      });
      login(res.data);
      navigate(from, { replace: true });
    } catch (err) {
      setError("Google authentication failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/api/users/login", {
        email,
        password,
      });
      login(response.data);
      navigate(from, { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Invalid email or password");
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex animate-in fade-in duration-700">
      {/* Left split - Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-primary/5 flex-col justify-between p-16 overflow-hidden border-r border-border/50">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?q=80&w=2000&auto=format&fit=crop"
            alt="Premium workspace background"
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity dark:opacity-[0.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
            <Store className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">
            Lumina Premium
          </span>
        </div>

        <div className="relative z-10 max-w-lg mt-auto pb-12">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Elevate your lifestyle.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Join thousands of customers who trust us for the highest quality
            tech, smart home, and modern living products.
          </p>
          <div className="flex items-center gap-4 mt-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full border-2 border-background bg-muted/80 flex items-center justify-center overflow-hidden z-[${4 - i}]`}
                >
                  <img
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="User"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Trusted by 10k+ customers
            </p>
          </div>
        </div>
      </div>

      {/* Right split - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
        <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom-4 duration-500 delay-150">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Welcome back
            </h2>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <div className="flex justify-center lg:justify-start w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() =>
                setError("Google authentication failed. Please try again.")
              }
              theme="filled_black"
              shape="pill"
              size="large"
              text="continue_with"
              width="100%"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground tracking-widest font-semibold">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm font-medium bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-center animate-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-foreground/80"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary text-foreground h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-foreground/80"
                  >
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-primary hover:underline transition-all"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-muted/30 border-muted-foreground/20 text-foreground focus-visible:ring-primary h-12 rounded-xl"
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
                  Sign In{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-primary hover:underline hover:text-primary/80 transition-colors"
            >
              Sign up today
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

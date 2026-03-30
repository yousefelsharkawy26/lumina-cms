import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Store, ArrowRight } from "lucide-react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

export const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/users/google", {
        idToken: credentialResponse.credential,
      });
      login(res.data);
      navigate("/");
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
      const response = await axios.post("/api/users/register", {
        name,
        email,
        password,
      });
      login(response.data);
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Registration failed. Please try again.",
        );
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex animate-in fade-in duration-700">
      {/* Left split - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
        <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom-4 duration-500 delay-150">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Create an account
            </h2>
            <p className="text-muted-foreground">
              Join Lumina Premium to discover exclusive products
            </p>
          </div>

          <div className="flex justify-center lg:justify-start">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() =>
                setError("Google authentication failed. Please try again.")
              }
              theme="filled_black"
              shape="pill"
              size="large"
              text="signup_with"
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 text-sm font-medium bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-center animate-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-foreground/80"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  disabled={loading}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary h-12 rounded-xl"
                />
              </div>
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
                  className="bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-foreground/80"
                >
                  Secure Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary h-12 rounded-xl"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98] group mt-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-primary hover:underline hover:text-primary/80 transition-colors"
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>

      {/* Right split - Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-primary/5 flex-col justify-between p-16 overflow-hidden border-l border-border/50">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2000&auto=format&fit=crop"
            alt="Premium workspace background"
            className="w-full h-full object-cover opacity-[0.15] mix-blend-luminosity dark:opacity-[0.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-l from-background/50 via-transparent to-transparent" />
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
            Join the future of retail.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Create your account today to save your favorite products, track your
            orders, and receive exclusive offers on premium goods.
          </p>
        </div>
      </div>
    </div>
  );
};

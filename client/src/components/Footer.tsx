import { Link, useLocation } from "react-router-dom";
import { Mail, Send } from "lucide-react";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FaGithub, FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";
import { useSettingsStore } from "../store/useSettingsStore";
import luminaLogo from "../assets/lumina-logo.png";

export const Footer = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const { settings } = useSettingsStore();

  return (
    <footer
      className={cn(
        "mt-auto border-t border-border bg-card transition-all duration-500",
        isAdmin && "md:pl-64",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-2 w-fit group">
                <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/90 transition-all duration-300">
                  <img
                    src={luminaLogo}
                    alt="Lumina Logo"
                    className="h-40 w-auto object-contain drop-shadow-sm transition-all duration-300"
                  />
                </div>
                <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  {settings?.storeName || "Lumina"}
                </span>
              </Link>
              <p className="text-muted-foreground max-w-sm leading-relaxed text-sm">
                Elevating your electronic and fashion experience with premium,
                handpicked products. Discover the future of smart commerce
                today.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold tracking-wide text-foreground">
                Subscribe to our newsletter
              </h4>
              <form
                className="flex max-w-sm gap-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="pl-9 bg-background focus-visible:ring-primary/50"
                    required
                  />
                </div>
                <Button type="submit" className="shrink-0 group">
                  <span className="sr-only sm:not-sr-only sm:mr-2">
                    Subscribe
                  </span>
                  <Send className="h-4 w-4 group-hover:block transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
              <p className="text-xs text-muted-foreground pt-1">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="space-y-5">
            <h4 className="text-sm font-semibold tracking-wide text-foreground">
              Explore
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/?categoryId=electronics"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  to="/?categoryId=fashion"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Fashion
                </Link>
              </li>
              <li>
                <Link
                  to="/?categoryId=home"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Home & Living
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="space-y-5">
            <h4 className="text-sm font-semibold tracking-wide text-foreground">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} {settings?.storeName || "Lumina"}{" "}
            Commerce. All rights reserved.
          </p>

          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
            >
              <span className="sr-only">Twitter</span>
              <FaTwitter className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
            >
              <span className="sr-only">Instagram</span>
              <FaInstagram className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
            >
              <span className="sr-only">Facebook</span>
              <FaFacebook className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
            >
              <span className="sr-only">GitHub</span>
              <FaGithub className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

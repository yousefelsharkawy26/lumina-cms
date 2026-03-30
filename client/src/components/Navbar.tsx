import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  ShoppingCart,
  Search,
  User,
  LogOut,
  PackageSearch,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { useCartStore, type Product } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { useSettingsStore } from "../store/useSettingsStore";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import luminaLogo from "../assets/lumina-logo.png";
import { SlideOutCart } from "./SlideOutCart";

export const Navbar = () => {
  const { getTotalItems, setIsCartOpen } = useCartStore();
  const totalItems = getTotalItems();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { settings } = useSettingsStore();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<
    (Product & { category?: { name: string } })[]
  >([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const urlQ = searchParams.get("q") || "";
  const [prevUrlQ, setPrevUrlQ] = useState(urlQ);
  if (urlQ !== prevUrlQ) {
    setPrevUrlQ(urlQ);
    setSearchTerm(urlQ);
  }

  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search autocomplete debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length > 1) {
        try {
          const { data } = await axios.get(
            `/api/products?q=${encodeURIComponent(searchTerm)}&limit=5`,
          );
          setSuggestions(data.products || []);
        } catch (err) {
          console.error("Failed to fetch search hints", err);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFocused(false);
    setIsMobileMenuOpen(false);
    if (searchTerm.trim()) {
      navigate(`/?q=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className="flex items-center space-x-0 flex-shrink-0 group"
              >
                <motion.img
                  src={luminaLogo}
                  alt="Lumina Logo"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-30 w-auto object-contain drop-shadow-sm transition-all duration-300"
                />
                <span className="font-extrabold text-xl tracking-wide text-foreground group-hover:text-primary transition-colors">
                  {settings?.storeName || "Lumina"}
                </span>
              </Link>
            </div>

            {/* Desktop Search */}
            <div
              className="flex-1 max-w-2xl mx-8 items-center hidden md:flex relative"
              ref={searchContainerRef}
            >
              <form
                onSubmit={handleSearchSubmit}
                className="w-full relative group"
              >
                <button
                  type="submit"
                  className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
                <Input
                  name="q"
                  type="text"
                  autoComplete="off"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  className="w-full pl-10 pr-4 bg-muted/60 hover:bg-muted focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary border-transparent rounded-full shadow-inner transition-all h-10 text-sm"
                  placeholder="Search premium products or categories..."
                />
              </form>

              <AnimatePresence>
                {isFocused && searchTerm.trim().length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-12 left-0 w-full bg-card border border-border rounded-xl shadow-2xl p-2 z-50 overflow-hidden"
                  >
                    {suggestions.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        <p className="text-[10px] font-bold text-muted-foreground px-3 py-1 uppercase tracking-widest">
                          Top Results
                        </p>
                        {suggestions.map(
                          (p: Product & { category?: { name: string } }) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setSearchTerm(p.name);
                                setIsFocused(false);
                                navigate(`/product/${p.id}`);
                              }}
                              className="flex flex-col items-start px-3 py-2 hover:bg-muted/60 rounded-lg transition-all text-left w-full group"
                            >
                              <span className="font-medium text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                {p.name}
                              </span>
                              <span className="text-xs text-muted-foreground capitalize mt-0.5">
                                {p.category?.name || "Uncategorized"}
                              </span>
                            </button>
                          ),
                        )}
                      </div>
                    ) : (
                      <div className="p-6 flex flex-col items-center justify-center text-muted-foreground">
                        <PackageSearch className="w-8 h-8 mb-3 opacity-40 text-primary" />
                        <p className="text-sm font-semibold text-foreground">
                          No strict matches found
                        </p>
                        <p className="text-xs opacity-80 mt-1 text-center">
                          Press Enter to search the entire catalog for "
                          {searchTerm}"
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Actions */}
            <div className="items-center space-x-2 hidden md:flex">
              <ThemeToggle />

              {isAuthenticated ? (
                <div className="relative ml-2" ref={userMenuRef}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-muted/80 transition-all border border-transparent hover:border-border"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <span className="text-sm font-medium hidden lg:block text-foreground max-w-[120px] truncate">
                      {user?.name?.split(" ")[0]}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-2xl py-2 z-50 origin-top-right overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-border/50 mb-1">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user?.email}
                          </p>
                        </div>

                        <div className="px-1 py-1 flex flex-col gap-0.5">
                          {user?.role === "ADMIN" && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors group"
                            >
                              <LayoutDashboard className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                              Admin Dashboard
                            </Link>
                          )}
                          <Link
                            to="/profile"
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors group"
                          >
                            <User className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            My Profile
                          </Link>
                        </div>

                        <div className="px-1 pt-1 mt-1 border-t border-border/50">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors group"
                          >
                            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="ml-2 flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted px-4 py-2 rounded-full transition-all"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-full shadow-md shadow-primary/20 transition-all active:scale-95"
                  >
                    Register
                  </Link>
                </div>
              )}

              <div className="h-6 w-px bg-border mx-2"></div>

              <button onClick={() => setIsCartOpen(true)}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group flex items-center p-2.5 rounded-full hover:bg-muted transition-colors"
                >
                  <ShoppingCart className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary border-2 border-background animate-in slide-in-from-bottom-2">
                      {totalItems}
                    </Badge>
                  )}
                </motion.div>
              </button>
            </div>

            {/* Mobile Actions (Cart + Menu Toggle) */}
            <div className="flex items-center space-x-2 md:hidden">
              <ThemeToggle />

              <button onClick={() => setIsCartOpen(true)}>
                <div className="relative group p-2 rounded-full hover:bg-muted transition-colors mr-1">
                  <ShoppingCart className="h-5 w-5 text-foreground" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary border-2 border-background">
                      {totalItems}
                    </Badge>
                  )}
                </div>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -mr-2 text-foreground hover:bg-muted rounded-full transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-20 left-0 right-0 max-h-[calc(100vh-5rem)] overflow-y-auto bg-card border-b border-border shadow-2xl z-40 md:hidden pb-6"
            >
              <div className="px-4 pt-4 pb-2 space-y-6">
                {/* Mobile Search */}
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                  <button
                    type="submit"
                    className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                  <Input
                    name="q"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 bg-muted border-transparent focus-visible:ring-primary rounded-xl h-11 text-base"
                    placeholder="Search products..."
                  />
                </form>

                {/* Mobile Auth/Links */}
                <div className="flex flex-col gap-2">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-3 px-3 py-4 bg-muted/50 rounded-xl mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg uppercase shadow-inner">
                          {user?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">
                            {user?.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user?.email}
                          </span>
                        </div>
                      </div>

                      {user?.role === "ADMIN" && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
                        >
                          <LayoutDashboard className="w-5 h-5 text-primary" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
                      >
                        <User className="w-5 h-5 text-muted-foreground" />
                        My Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 mt-4 text-base font-medium text-destructive bg-destructive/5 hover:bg-destructive/10 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <Link
                        to="/login"
                        className="flex justify-center items-center py-3 text-base font-semibold border border-border bg-card text-foreground hover:bg-muted rounded-xl transition-all shadow-sm"
                      >
                        Log in
                      </Link>
                      <Link
                        to="/register"
                        className="flex justify-center items-center py-3 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-md transition-all active:scale-95"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SlideOutCart />
    </>
  );
};

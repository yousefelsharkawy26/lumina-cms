import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Package,
  Users,
  ShoppingCart,
  Settings,
  LayoutDashboard,
  List,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/button";

export const AdminLayout = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Auto-collapse on small screens
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsOpen(false);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: List },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-muted/20 relative overflow-hidden">
      {/* Mobile Back-drop Map */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 transition-opacity animate-in fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Architecture */}
      <aside
        className={cn(
          "border-r bg-card/95 backdrop-blur-xl shadow-2xl md:shadow-sm fixed h-full z-40 transition-all duration-300 ease-in-out flex flex-col",
          isOpen
            ? "w-64 translate-x-0"
            : "w-20 -translate-x-full md:translate-x-0",
        )}
      >
        {/* Header / Hamburger Toggle */}
        <div
          className={cn(
            "h-20 flex items-center border-b border-border/50 shrink-0",
            isOpen ? "justify-between px-6" : "justify-center px-0",
          )}
        >
          {isOpen && (
            <h2 className="text-xl font-bold tracking-tight text-foreground whitespace-nowrap overflow-hidden animate-in fade-in duration-300">
              Admin CMS
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="text-muted-foreground hover:bg-muted/50 rounded-xl"
            title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Dynamic Navigation Links */}
        <nav className="flex-1 space-y-2 p-4 overflow-y-auto overflow-x-hidden sidebar-scroll">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => {
                  if (isMobile) setIsOpen(false);
                }}
              >
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  title={!isOpen ? item.name : undefined}
                  className={cn(
                    "w-full h-12 transition-all duration-200 rounded-xl",
                    isOpen ? "justify-start gap-4 px-4" : "justify-center px-0",
                    isActive
                      ? "bg-primary/10 text-primary font-bold shadow-sm hover:bg-primary/20"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn("shrink-0", isOpen ? "w-5 h-5" : "w-6 h-6")}
                  />
                  {isOpen && <span className="truncate">{item.name}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Administrative Action Area */}
      <main
        className={cn(
          "flex-1 p-4 md:p-8 animate-in fade-in duration-500 w-full transition-all duration-300 ease-in-out",
          isOpen ? "md:ml-64" : "md:ml-20",
        )}
      >
        {/* Mobile floating button to re-summon the sidebar */}
        {isMobile && !isOpen && (
          <Button
            variant="default"
            size="icon"
            className="fixed bottom-6 right-6 z-20 rounded-full shadow-2xl h-14 w-14 animate-in zoom-in slide-in-from-bottom-2"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="w-6 h-6 text-primary-foreground" />
          </Button>
        )}

        <Outlet />
      </main>
    </div>
  );
};

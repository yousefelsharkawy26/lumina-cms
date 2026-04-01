import { useState, useEffect } from "react";
import { 
  Store, 
  Settings, 
  CreditCard, 
  Bell, 
  Shield, 
  Save, 
  Palette, 
  Loader2,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axiosInstance";
import { useAuthStore } from "../../store/useAuthStore";

export const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useAuthStore();
  const token = user?.token || localStorage.getItem("token");

  // General 
  const [storeName, setStoreName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [currency, setCurrency] = useState("USD ($)");

  // Appearance
  const [theme, setTheme] = useState("system");

  // Billing
  const [taxRate, setTaxRate] = useState("0");
  const [stripePublicKey, setStripePublicKey] = useState("");
  const [stripeSecretKey, setStripeSecretKey] = useState("");

  // Notifications
  const [orderEmails, setOrderEmails] = useState(true);
  const [stockAlerts, setStockAlerts] = useState(true);

  // Security
  const [twoFactorAdmin, setTwoFactorAdmin] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("24");

  // Advanced
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [apiVersion, setApiVersion] = useState("v1.0.0");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axiosInstance.get("/api/settings");
        if (data) {
          setStoreName(data.storeName || "");
          setSupportEmail(data.supportEmail || "");
          setCurrency(data.currency || "USD ($)");
          
          setTheme(data.theme || "system");
          
          setTaxRate(data.taxRate?.toString() || "0");
          setStripePublicKey(data.stripePublicKey || "");
          setStripeSecretKey(data.stripeSecretKey || "");
          
          setOrderEmails(data.orderEmails ?? true);
          setStockAlerts(data.stockAlerts ?? true);
          
          setTwoFactorAdmin(data.twoFactorAdmin ?? false);
          setSessionTimeout(data.sessionTimeout?.toString() || "24");
          
          setMaintenanceMode(data.maintenanceMode ?? false);
          setApiVersion(data.apiVersion || "v1.0.0");
        }
      } catch (error) {
        console.error("Failed to fetch store settings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await axiosInstance.put(
        "/api/settings",
        { 
          storeName, supportEmail, currency,
          theme, 
          taxRate: parseFloat(taxRate) || 0,
          stripePublicKey, stripeSecretKey,
          orderEmails, stockAlerts, 
          twoFactorAdmin, sessionTimeout: parseInt(sessionTimeout, 10) || 24,
          maintenanceMode, apiVersion
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to update store settings", error);
      alert("Failed to save configuration via API");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const tabs = [
    { id: "general", label: "General Store", icon: Store },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "billing", label: "Billing & Taxes", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "advanced", label: "Advanced", icon: Settings },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Platform Settings
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Configure how your Lumina store operates behind the scenes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Settings Navigation */}
        <div className="col-span-1 border-r border-border pr-6">
          <nav className="flex flex-col space-y-2 sticky top-24">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-primary/10 text-primary font-bold shadow-sm"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:translate-x-1"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "opacity-70"}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content Content - Glassmorphic Card */}
        <div className="col-span-3">
          <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-xl overflow-hidden relative">
            <div className="p-8 space-y-10 min-h-[500px]">
              
              {/* General Tab */}
              {activeTab === "general" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                  <div className="border-b border-border/50 pb-5">
                    <h2 className="text-2xl font-bold text-foreground">General Configuration</h2>
                    <p className="text-muted-foreground text-sm mt-1">Manage core platform identity metrics.</p>
                  </div>
                  
                  <div className="space-y-6 max-w-xl">
                    <div className="space-y-3">
                      <Label htmlFor="storeName" className="text-sm font-semibold">Store Brand Name</Label>
                      <Input id="storeName" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="h-12 bg-background/50 focus:bg-background transition-colors text-base" />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="supportEmail" className="text-sm font-semibold">Support Contact Email</Label>
                      <Input id="supportEmail" type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className="h-12 bg-background/50 focus:bg-background transition-colors text-base" />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="currency" className="text-sm font-semibold">Base Currency</Label>
                      <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full h-12 px-4 rounded-md border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-colors">
                        <option value="USD ($)" className="bg-background text-foreground">US Dollar (USD)</option>
                        <option value="EUR (€)" className="bg-background text-foreground">Euro (EUR)</option>
                        <option value="GBP (£)" className="bg-background text-foreground">British Pound (GBP)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === "appearance" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                  <div className="border-b border-border/50 pb-5">
                    <h2 className="text-2xl font-bold text-foreground">Store Appearance</h2>
                    <p className="text-muted-foreground text-sm mt-1">Control visual aesthetics globally.</p>
                  </div>
                  <div className="space-y-6 max-w-xl">
                    <div className="space-y-3">
                      <Label htmlFor="theme" className="text-sm font-semibold">Default Global Theme</Label>
                      <select id="theme" value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full h-12 px-4 rounded-md border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-colors">
                        <option value="system" className="bg-background text-foreground">System Default</option>
                        <option value="light" className="bg-background text-foreground">Force Light Mode</option>
                        <option value="dark" className="bg-background text-foreground">Force Dark Mode</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === "billing" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                  <div className="border-b border-border/50 pb-5">
                    <h2 className="text-2xl font-bold text-foreground">Billing & Taxes</h2>
                    <p className="text-muted-foreground text-sm mt-1">Secure payment processing integration.</p>
                  </div>
                  <div className="space-y-6 max-w-xl">
                    <div className="space-y-3">
                      <Label htmlFor="taxRate" className="text-sm font-semibold">Global Tax Rate (%)</Label>
                      <Input id="taxRate" type="number" step="0.01" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="h-12 bg-background/50 focus:bg-background transition-colors text-base" />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="stripePublicKey" className="text-sm font-semibold">Stripe Public Key</Label>
                      <Input id="stripePublicKey" value={stripePublicKey} onChange={(e) => setStripePublicKey(e.target.value)} className="h-12 border-primary/20 bg-primary/5 focus:bg-background transition-colors text-base font-mono text-sm" placeholder="pk_test_..." />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="stripeSecretKey" className="text-sm font-semibold">Stripe Secret Key</Label>
                      <Input id="stripeSecretKey" type="password" value={stripeSecretKey} onChange={(e) => setStripeSecretKey(e.target.value)} className="h-12 border-primary/20 bg-primary/5 focus:bg-background transition-colors text-base font-mono text-sm" placeholder="sk_test_..." />
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                  <div className="border-b border-border/50 pb-5">
                    <h2 className="text-2xl font-bold text-foreground">Notification Routing</h2>
                    <p className="text-muted-foreground text-sm mt-1">Manage system-generated automated emails.</p>
                  </div>
                  <div className="space-y-6 max-w-xl">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background/30">
                      <div>
                        <Label className="text-sm font-semibold">Order Confirmations</Label>
                        <p className="text-xs text-muted-foreground">Automatically email customers when payment clears.</p>
                      </div>
                      <input type="checkbox" checked={orderEmails} onChange={(e) => setOrderEmails(e.target.checked)} className="w-5 h-5 accent-primary" />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background/30">
                      <div>
                        <Label className="text-sm font-semibold">Low Stock Alerts</Label>
                        <p className="text-xs text-muted-foreground">Email admin team when product inventory dips below 5.</p>
                      </div>
                      <input type="checkbox" checked={stockAlerts} onChange={(e) => setStockAlerts(e.target.checked)} className="w-5 h-5 accent-primary" />
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                  <div className="border-b border-border/50 pb-5">
                    <h2 className="text-2xl font-bold text-foreground">Security Policies</h2>
                    <p className="text-muted-foreground text-sm mt-1">Platform integrity constraints.</p>
                  </div>
                  <div className="space-y-6 max-w-xl">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
                      <div>
                        <Label className="text-sm font-semibold text-amber-600 dark:text-amber-500">Enforce 2FA on Admins</Label>
                        <p className="text-xs text-amber-600/80 dark:text-amber-500/80">Require SMS code for dashboard access.</p>
                      </div>
                      <input type="checkbox" checked={twoFactorAdmin} onChange={(e) => setTwoFactorAdmin(e.target.checked)} className="w-5 h-5 accent-amber-500" />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="sessionTimeout" className="text-sm font-semibold">Administrative Session Timeout (Hours)</Label>
                      <Input id="sessionTimeout" type="number" min="1" max="72" value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} className="h-12 bg-background/50 focus:bg-background transition-colors text-base" />
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Tab */}
              {activeTab === "advanced" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                  <div className="border-b border-border/50 pb-5">
                    <h2 className="text-2xl font-bold text-foreground">Advanced Development</h2>
                    <p className="text-muted-foreground text-sm mt-1">High-risk system configurations.</p>
                  </div>
                  <div className="space-y-6 max-w-xl">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/30 bg-destructive/10">
                      <div>
                        <Label className="text-sm font-semibold text-destructive">Maintenance Mode</Label>
                        <p className="text-xs text-destructive/80">Disables storefront routing for all non-admin users.</p>
                      </div>
                      <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="w-5 h-5 accent-destructive" />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="apiVersion" className="text-sm font-semibold">API Hook Versioning</Label>
                      <select id="apiVersion" value={apiVersion} onChange={(e) => setApiVersion(e.target.value)} className="w-full h-12 px-4 rounded-md border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-colors font-mono text-sm">
                        <option value="v1.0.0" className="bg-background text-foreground">v1.0.0 (Stable)</option>
                        <option value="v2.0.0-beta" className="bg-background text-foreground">v2.0.0-beta (Experimental)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Sticky Save Footer */}
            <div className="sticky bottom-0 bg-muted/90 backdrop-blur-xl border-t border-border/50 p-6 px-8 flex justify-between items-center z-10">
              <div className="text-sm text-muted-foreground">
                <AlertTriangle className="w-4 h-4 inline mr-2 opacity-70" />
                Unsaved changes will be lost immediately.
              </div>
              <div className="flex items-center gap-4">
                {saved && (
                  <span className="flex items-center gap-2 text-sm text-green-500 font-medium animate-in fade-in slide-in-from-left-2">
                    <CheckCircle2 className="w-4 h-4" /> System Updated
                  </span>
                )}
                <Button 
                  onClick={handleSave} 
                  disabled={saving} 
                  className="h-11 px-8 shadow-md hover:shadow-lg transition-all"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  {saving ? "Deploying..." : "Save Configuration"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

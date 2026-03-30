import { create } from "zustand";
import axios from "axios";

export interface SystemSettings {
  storeName: string;
  supportEmail: string;
  currency: string;
  theme: string;
  taxRate: number;
  stripePublicKey: string;
  stripeSecretKey: string;
  orderEmails: boolean;
  stockAlerts: boolean;
  twoFactorAdmin: boolean;
  sessionTimeout: number;
  maintenanceMode: boolean;
  apiVersion: string;
}

interface SettingsState {
  settings: SystemSettings | null;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  loading: true,
  error: null,
  fetchSettings: async () => {
    try {
      const { data } = await axios.get("/api/settings");
      set({ settings: data, loading: false, error: null });
    } catch (err) {
      console.error("Failed to load global store settings:", err);
      set({
        error: "Failed to load store settings",
        loading: false,
        settings: {
          storeName: "Lumina",
          supportEmail: "support@brand.com",
          currency: "USD ($)",
          theme: "system",
          taxRate: 0,
          stripePublicKey: "",
          stripeSecretKey: "",
          orderEmails: true,
          stockAlerts: true,
          twoFactorAdmin: false,
          sessionTimeout: 24,
          maintenanceMode: false,
          apiVersion: "v1.0.0",
        },
      });
    }
  },
}));

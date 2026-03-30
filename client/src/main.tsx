import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ThemeProvider from "./components/ThemeProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "342150475088-4btisj3mh8vkls0565di5usniep5oojl.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);

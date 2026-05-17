import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { DialogueInterestProvider } from "./context/DialogueInterestContext";
import { LanguageProvider } from "./i18n";
import "./index.css";
import { registerServiceWorker } from "./lib/registerPwa";

registerServiceWorker();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <DialogueInterestProvider>
        <App />
      </DialogueInterestProvider>
    </LanguageProvider>
  </StrictMode>,
);

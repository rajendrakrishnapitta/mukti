import { useEffect, useState } from "react";
import styles from "./PwaInstallHint.module.css";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

export function PwaInstallHint() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("mukti-pwa-dismiss") === "1") {
      setDismissed(true);
    }
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (dismissed || !deferred) return null;

  return (
    <div className={styles.banner} role="region" aria-label="Install app">
      <p>Add Mukti to your home screen for daily inquiry.</p>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.install}
          onClick={() => void deferred.prompt()}
        >
          Install
        </button>
        <button
          type="button"
          className={styles.dismiss}
          onClick={() => {
            localStorage.setItem("mukti-pwa-dismiss", "1");
            setDismissed(true);
          }}
        >
          Not now
        </button>
      </div>
    </div>
  );
}

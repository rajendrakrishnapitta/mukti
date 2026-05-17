import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "mukti-journal";

export function useJournal(contemplationId: string) {
  const storageKey = `${STORAGE_KEY}:${contemplationId}`;
  const [entry, setEntry] = useState("");

  useEffect(() => {
    try {
      setEntry(localStorage.getItem(storageKey) ?? "");
    } catch {
      setEntry("");
    }
  }, [storageKey]);

  const save = useCallback(
    (text: string) => {
      setEntry(text);
      try {
        if (text.trim()) {
          localStorage.setItem(storageKey, text);
        } else {
          localStorage.removeItem(storageKey);
        }
      } catch {
        /* storage unavailable */
      }
    },
    [storageKey],
  );

  return { entry, save };
}

import type { ReactNode } from "react";
import { useLanguage } from "../i18n";
import type { ViewId } from "../types";
import { LanguageSelect } from "./LanguageSelect";
import { PwaInstallHint } from "./PwaInstallHint";
import styles from "./Layout.module.css";

interface LayoutProps {
  view: ViewId;
  onNavigate: (view: ViewId) => void;
  children: ReactNode;
}

const VIEW_IDS: ViewId[] = ["home", "dialogue", "practice"];

export function Layout({ view, onNavigate, children }: LayoutProps) {
  const { t } = useLanguage();

  const navItems = VIEW_IDS.map((id) => {
    const nav = t.nav;
    switch (id) {
      case "home":
        return { id, label: nav.home, subtitle: nav.homeSub };
      case "dialogue":
        return { id, label: nav.dialogue, subtitle: nav.dialogueSub };
      case "practice":
        return { id, label: nav.sit, subtitle: nav.sitSub };
    }
  });

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <button
            type="button"
            className={styles.brand}
            onClick={() => onNavigate("home")}
            aria-label="Mukti home"
          >
            <span className={styles.brandSymbol}>無</span>
            <span className={styles.brandText}>
              <span className={styles.brandName}>Mukti</span>
              <span className={styles.brandTag}>{t.brandTag}</span>
            </span>
          </button>
          <LanguageSelect />
        </div>
        <nav className={styles.nav} aria-label="Main">
          {navItems.map((v) => (
            <button
              key={v.id}
              type="button"
              className={`${styles.navItem} ${view === v.id ? styles.navActive : ""}`}
              onClick={() => onNavigate(v.id)}
              aria-current={view === v.id ? "page" : undefined}
            >
              <span className={styles.navLabel}>{v.label}</span>
              <span className={styles.navSub}>{v.subtitle}</span>
            </button>
          ))}
        </nav>
      </header>
      <main className={styles.main}>
        <PwaInstallHint />
        {children}
      </main>
      <footer className={styles.footer}>
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}

import { LANGUAGES, useLanguage } from "../i18n";
import styles from "./LanguageSelect.module.css";

export function LanguageSelect() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <label className={styles.wrap}>
      <span className={styles.label}>{t.languageLabel}</span>
      <select
        className={styles.select}
        value={language}
        onChange={(e) => setLanguage(e.target.value as typeof language)}
        aria-label={t.languageLabel}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.native}
          </option>
        ))}
      </select>
    </label>
  );
}

import { philosophyInquiryIds, type PhilosophyInquiryId } from "../data/philosophyInquiries";
import { useLanguage } from "../i18n";
import styles from "./PhilosopherSelect.module.css";

interface PhilosophyInquirySelectProps {
  value: PhilosophyInquiryId;
  onChange: (id: PhilosophyInquiryId) => void;
}

export function PhilosophyInquirySelect({
  value,
  onChange,
}: PhilosophyInquirySelectProps) {
  const { t } = useLanguage();
  const labels = t.home.inquiryPhilosophyOptions;

  return (
    <label className={styles.wrap}>
      <span className={styles.label}>{t.home.inquiryPhilosophyLabel}</span>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value as PhilosophyInquiryId)}
        aria-label={t.home.inquiryPhilosophyLabel}
      >
        <option value="daily">{labels.daily}</option>
        {philosophyInquiryIds()
          .filter((id) => id !== "daily")
          .map((id) => (
            <option key={id} value={id}>
              {labels[id]}
            </option>
          ))}
      </select>
    </label>
  );
}

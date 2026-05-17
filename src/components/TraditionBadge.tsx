import styles from "./TraditionBadge.module.css";

interface TraditionBadgeProps {
  label: string;
}

export function TraditionBadge({ label }: TraditionBadgeProps) {
  return <span className={styles.badge}>{label}</span>;
}

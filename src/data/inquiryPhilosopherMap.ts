import type { PhilosophyInquiryId } from "./philosophyInquiries";

/** Best philosopher match when opening Dialogue from Today's inquiry path */
export const INQUIRY_PHILOSOPHER_MAP: Partial<
  Record<PhilosophyInquiryId, string>
> = {
  buddhism: "buddha",
  advaita: "ramana-maharshi",
  stoicism: "epictetus",
  taoism: "laozi",
  zen: "krishnamurti",
  existentialism: "nietzsche",
  socratic: "socrates",
  upaniṣadic: "shankara",
  sufi: "rumi",
  confucian: "confucius",
  bhakti: "mirabai",
  phenomenology: "wittgenstein",
  ethics: "kant",
  daily: "socrates",
};

export function philosopherIdForInquiry(
  inquiryId: PhilosophyInquiryId,
): string | undefined {
  return INQUIRY_PHILOSOPHER_MAP[inquiryId];
}

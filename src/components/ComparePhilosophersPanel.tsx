import { useState } from "react";
import type { PhilosopherProfile } from "../data/philosophers";
import { PhilosopherSelect } from "./PhilosopherSelect";
import styles from "./ComparePhilosophersPanel.module.css";

interface ComparePhilosophersPanelProps {
  philosophers: PhilosopherProfile[];
  onCompare: (idA: string, idB: string, topic: string) => void;
}

export function ComparePhilosophersPanel({
  philosophers,
  onCompare,
}: ComparePhilosophersPanelProps) {
  const [idA, setIdA] = useState("socrates");
  const [idB, setIdB] = useState("buddha");
  const [topic, setTopic] = useState("What is the self, and how should one live?");

  return (
    <div className={styles.wrap}>
      <p className={styles.lead}>
        Pick two thinkers and a topic. You will get two distinct voices plus where
        they differ.
      </p>
      <div className={styles.pickers}>
        <PhilosopherSelect
          philosophers={philosophers}
          selectedId={idA}
          onSelect={setIdA}
        />
        <PhilosopherSelect
          philosophers={philosophers}
          selectedId={idB}
          onSelect={setIdB}
        />
      </div>
      <label className={styles.topicLabel}>
        Topic
        <textarea
          className={styles.topic}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={2}
        />
      </label>
      <button
        type="button"
        className={styles.go}
        onClick={() => onCompare(idA, idB, topic.trim())}
        disabled={!topic.trim() || idA === idB}
      >
        Compare
      </button>
    </div>
  );
}

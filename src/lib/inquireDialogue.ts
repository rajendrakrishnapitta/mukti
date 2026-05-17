import type { Contemplation } from "../data/content";

export function contemplationDialoguePrompt(
  c: Contemplation,
  reflection?: string,
): string {
  let prompt = `I'm sitting with this inquiry from ${c.tradition} (${c.category}): "${c.prompt}"`;
  if (c.hint) prompt += ` A hint I'm holding: ${c.hint}.`;
  if (c.source) prompt += ` Related source: ${c.source}.`;
  prompt +=
    " Help me inquire deeply—don't hand me a final answer. Compare how other traditions approach this question, name common traps, and offer one further question to sit with.";
  const trimmed = reflection?.trim();
  if (trimmed) {
    prompt += ` My private reflection so far: "${trimmed}"`;
  }
  return prompt;
}

export function contemplationDialogueStarters(c: Contemplation): string[] {
  const short =
    c.prompt.length > 72 ? `${c.prompt.slice(0, 69)}…` : c.prompt;
  return [
    `How does ${c.tradition} approach: "${short}"?`,
    `What do other philosophies say about the same question?`,
    `What is one way to sit with this inquiry without rushing to an answer?`,
  ];
}

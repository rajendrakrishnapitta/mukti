import type { ThemeExploration, WisdomPath } from "../data/content";

export function themeDialoguePrompt(theme: ThemeExploration): string {
  const names = theme.perspectives.map((p) => p.tradition).join(", ");
  return `I'm exploring the theme "${theme.theme}". ${theme.overview} Compare how these traditions approach it: ${names}. Where do they agree, where do they diverge, and what should I sit with in my own experience?`;
}

export function perspectiveDialoguePrompt(
  theme: ThemeExploration,
  tradition: string,
  insight: string,
): string {
  return `I'm exploring "${theme.theme}" through ${tradition}: "${insight}" Help me go deeper—key ideas, texts or teachers, common misunderstandings, and one concrete question or practice to try.`;
}

export function pathDialoguePrompt(path: WisdomPath): string {
  return `I want to explore the wisdom path "${path.name}": ${path.insight} A practice I'm sitting with: "${path.practice}" What do diverse sources say about this path? Suggest further reading, contrasts with other traditions, and questions for self-inquiry.`;
}

export function themeDialogueStarters(theme: ThemeExploration): string[] {
  const a = theme.perspectives[0]?.tradition ?? "one tradition";
  const b = theme.perspectives[1]?.tradition ?? "another";
  const topic = theme.theme.toLowerCase();
  return [
    `Compare ${a} and ${b} on ${topic}. Where do they agree and disagree?`,
    `What does contemporary science or psychology say about ${topic}?`,
    `What is one daily practice from any tradition for exploring ${topic}?`,
  ];
}

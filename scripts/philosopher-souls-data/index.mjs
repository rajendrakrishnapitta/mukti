import { greekAncientSouls } from "./batch-greek-ancient.mjs";
import { modernWestSouls } from "./batch-modern-west.mjs";
import { indicMysticSouls } from "./batch-indic-mystic.mjs";
import { teluguSouls } from "./batch-telugu.mjs";
import { hindiSouls } from "./batch-hindi.mjs";

export const SOULS = {
  ...greekAncientSouls,
  ...modernWestSouls,
  ...indicMysticSouls,
  ...teluguSouls,
  ...hindiSouls,
};

export const SOUL_IDS = Object.keys(SOULS).sort();
